'use client'

import { useLenis } from 'lenis/react'
import { ChevronDown, TextAlignJustify } from 'lucide-react'
import { AnimatePresence, motion, useScroll } from 'motion/react'
import { type FC, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils/common/shadcn'

export type Heading = {
  level: number
  text: string
  id: string
}

const TocProgressCircle = ({ container }: { container: HTMLElement }) => {
  const ref = useRef(container)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  return (
    <motion.circle
      cx="50"
      cy="50"
      r="36"
      pathLength="1"
      className="fill-none stroke-black/70 dark:stroke-white/70"
      strokeWidth="8"
      style={{
        pathLength: scrollYProgress,
      }}
    />
  )
}

export const PostToc: FC<{
  headings: Heading[]
}> = ({ headings }) => {
  const [activeId, setActiveId] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [articleContent, setArticleContent] = useState<HTMLElement | null>(null)
  const lenis = useLenis()

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
      setArticleContent(document.getElementById('article-content'))
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-10% 0px -80% 0px' },
    )

    headings.forEach(heading => {
      const element = document.getElementById(heading.id)
      if (element != null) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings, mounted])

  if (headings.length === 0) return null
  if (!mounted) return null

  const activeHeading = headings.find(h => h.id === activeId) ?? headings[0]

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()

    if (lenis != null) {
      const target = document.getElementById(id)
      if (target != null) {
        lenis.scrollTo(target, { offset: -80 })
      }
      setActiveId(id)
      setIsExpanded(false)
      return
    }

    const element = document.getElementById(id)
    if (element != null) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })

      setActiveId(id)
      setIsExpanded(false)
    }
  }

  return createPortal(
    <motion.div
      layout
      className={cn(
        'fixed bottom-8 left-1/2 z-50 -translate-x-1/2',
        'bg-clear-sky-background/80 backdrop-blur-sm dark:bg-black/70',
        'border border-[#00000011] dark:border-white/10',
        'shadow-[0px_4px_10px_0px_#0000001A]',
        'overflow-hidden',
        'max-w-[90vw]',
        isExpanded ? 'rounded-2xl' : 'rounded-full',
      )}
      initial={{ width: 300 }}
      animate={{
        width: isExpanded ? 360 : 300,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.div layout="position" className="flex flex-col">
        <div
          className={cn(
            'flex cursor-pointer items-center justify-between transition-colors hover:bg-black/5 dark:hover:bg-white/5',
            'px-2 py-1',
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <motion.div
            layout="position"
            className="flex max-w-75 items-center justify-between gap-1 truncate text-sm font-medium"
          >
            <figure className="sticky top-6 flex items-center justify-center">
              <svg height={28} width={28} viewBox="0 0 100 100" className="-rotate-90">
                {/* background */}
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  pathLength="1"
                  className="fill-none stroke-black/10 dark:stroke-white/10"
                  strokeWidth="4"
                />

                {/* progress */}
                {articleContent != null ? (
                  <TocProgressCircle container={articleContent} />
                ) : (
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="36"
                    pathLength="1"
                    className="fill-none stroke-black/70 dark:stroke-white/70"
                    strokeWidth="4"
                    style={{ pathLength: 0 }}
                  />
                )}
              </svg>
            </figure>
            <span>{activeHeading?.text ?? '目录'}</span>
          </motion.div>
          <motion.div
            layout="position"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-muted-foreground ml-2"
          >
            {isExpanded ? (
              <TextAlignJustify className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </motion.div>
        </div>

        {/* expanded list */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="max-h-[60vh] overflow-x-hidden overflow-y-auto border-t border-black/5 dark:border-white/5"
            >
              <ul className="flex flex-col gap-1 p-2">
                {headings.map(heading => (
                  <li key={heading.id} style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}>
                    <a
                      href={`#${heading.id}`}
                      onClick={e => handleLinkClick(e, heading.id)}
                      className={cn(
                        'block truncate rounded-md px-2 py-1.5 text-sm transition-colors',
                        activeId === heading.id
                          ? 'text-foreground bg-black/5 font-medium dark:bg-white/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5',
                      )}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
