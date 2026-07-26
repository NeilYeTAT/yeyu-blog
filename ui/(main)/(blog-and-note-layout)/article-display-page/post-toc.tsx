'use client'

import type { Heading } from './utils/extract-headings'
import { ChevronDown, TextAlignJustify } from 'lucide-react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { type FC, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils/common/shadcn'
import { useIsAnimationComplete } from '@/store/use-startup-store'

const variants = {
  enter: (direction: number) => ({
    y: direction * 20,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    y: direction * -20,
    opacity: 0,
  }),
}

const tocProgressRadius = 34
const tocProgressStrokeWidth = 10
const emptyPortalState: {
  articleContent: HTMLElement | null
  container: HTMLElement | null
} = {
  articleContent: null,
  container: null,
}

let portalStateSnapshot = emptyPortalState

const subscribePortalState = (onStoreChange: () => void) => {
  const frame = requestAnimationFrame(onStoreChange)
  return () => cancelAnimationFrame(frame)
}

const getPortalStateSnapshot = () => {
  const articleContent = document.getElementById('article-content')
  const container = document.body

  if (
    portalStateSnapshot.articleContent === articleContent &&
    portalStateSnapshot.container === container
  ) {
    return portalStateSnapshot
  }

  portalStateSnapshot = {
    articleContent,
    container,
  }

  return portalStateSnapshot
}

const getServerPortalStateSnapshot = () => emptyPortalState

const ArticleBottomShadow = ({
  container,
  visible,
}: {
  container: HTMLElement
  visible: boolean
}) => {
  const ref = useRef(container)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.84, 0.96, 1], [0.46, 0.46, 0.16, 0])

  if (!visible) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-16 select-none bg-[linear-gradient(transparent,rgb(249,250,250))] backdrop-blur-[10px] [-webkit-mask-image:linear-gradient(to_top,rgb(249,250,250)_40%,transparent)] [mask-image:linear-gradient(to_top,rgb(249,250,250)_40%,transparent)] dark:bg-[linear-gradient(transparent,rgb(9,9,11))] dark:[-webkit-mask-image:linear-gradient(to_top,rgb(9,9,11)_40%,transparent)] dark:[mask-image:linear-gradient(to_top,rgb(9,9,11)_40%,transparent)]"
      style={{ opacity: shadowOpacity }}
    />
  )
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
      r={tocProgressRadius}
      pathLength="1"
      className="fill-none stroke-black/70 dark:stroke-white/70"
      strokeWidth={tocProgressStrokeWidth}
      strokeLinecap="round"
      style={{
        pathLength: scrollYProgress,
      }}
    />
  )
}

export const PostToc: FC<{
  headings: Heading[]
}> = ({ headings }) => {
  const isAnimationComplete = useIsAnimationComplete()
  const [{ activeId, direction }, setActiveHeading] = useState({
    activeId: '',
    direction: 1,
  })
  const [isExpanded, setIsExpanded] = useState(false)
  const portalState = useSyncExternalStore(
    subscribePortalState,
    getPortalStateSnapshot,
    getServerPortalStateSnapshot,
  )
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const updateActiveHeading = useCallback(
    (nextActiveId: string) => {
      setActiveHeading(current => {
        if (current.activeId === nextActiveId) return current

        const nextIndex = headings.findIndex(heading => heading.id === nextActiveId)
        const currentIndex = headings.findIndex(heading => heading.id === current.activeId)
        let nextDirection = current.direction

        if (currentIndex !== -1 && nextIndex !== -1) {
          nextDirection = nextIndex > currentIndex ? 1 : -1
        }

        return {
          activeId: nextActiveId,
          direction: nextDirection,
        }
      })
    },
    [headings],
  )

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            updateActiveHeading(entry.target.id)
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
  }, [headings, updateActiveHeading])

  if (headings.length === 0) return null
  if (portalState.container == null) return null

  const { articleContent, container } = portalState
  const activeHeading = headings.find(h => h.id === activeId) ?? headings[0]

  const scrollActiveLinkIntoView = () => {
    if (scrollContainerRef.current == null || activeId === '') return

    const activeLink = Array.from(
      scrollContainerRef.current.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
    ).find(link => link.hash.slice(1) === activeId)
    if (activeLink == null) return

    const container = scrollContainerRef.current
    const top = activeLink.offsetTop
    const linkHeight = activeLink.clientHeight
    const containerHeight = Math.min(container.scrollHeight, window.innerHeight * 0.6)

    container.scrollTo({
      top: top - containerHeight / 2 + linkHeight / 2,
      behavior: 'instant',
    })
  }

  const handleTocToggleClick = () => {
    if (isExpanded) {
      setIsExpanded(false)
      return
    }

    setIsExpanded(true)
    requestAnimationFrame(scrollActiveLinkIntoView)
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()

    const element = document.getElementById(id)
    if (element != null) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset

      updateActiveHeading(id)
      setIsExpanded(false)

      requestAnimationFrame(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
      })
    }
  }

  return createPortal(
    <>
      {articleContent != null ? (
        <ArticleBottomShadow container={articleContent} visible={isAnimationComplete} />
      ) : null}
      <AnimatePresence>
        {isExpanded && (
          <motion.button
            type="button"
            aria-label="关闭文章目录"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 cursor-default appearance-none border-0 bg-black/20 p-0 backdrop-blur-sm dark:bg-black/40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
      <motion.div
        layout
        className={cn(
          'fixed bottom-8 left-1/2 z-50 -translate-x-1/2',
          'bg-theme-background/80 backdrop-blur-sm dark:bg-black/70',
          'border border-[#00000011] dark:border-white/10',
          'shadow-[0_16px_46px_color-mix(in_srgb,var(--theme-400)_34%,transparent)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.58)]',
          'overflow-hidden',
          'max-w-[90vw]',
          isExpanded ? 'w-[360px]' : 'w-[300px]',
          isExpanded ? 'rounded-2xl' : 'rounded-full',
        )}
        initial={{ y: 100, opacity: 0 }}
        animate={
          isAnimationComplete
            ? {
                y: 0,
                opacity: 1,
              }
            : {
                y: 100,
                opacity: 0,
                transition: { duration: 0 },
              }
        }
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <motion.div layout="position" className="flex flex-col">
          <motion.button
            layout="position"
            type="button"
            aria-expanded={isExpanded}
            aria-label="切换文章目录"
            className={cn(
              'flex w-full cursor-pointer items-center justify-between border-0 bg-transparent text-left text-inherit transition-colors hover:bg-black/5 dark:hover:bg-white/5',
              'py-1',
              isExpanded ? 'px-2' : 'pr-3 pl-1',
            )}
            onClick={handleTocToggleClick}
          >
            <motion.div className="relative flex max-w-75 items-center justify-between gap-1 truncate font-medium text-sm">
              <figure className="flex items-center justify-center">
                <svg height={28} width={28} viewBox="0 0 100 100" className="-rotate-90">
                  {/* background */}
                  <circle
                    cx="50"
                    cy="50"
                    r={tocProgressRadius}
                    pathLength="1"
                    className="fill-none stroke-black/10 dark:stroke-white/10"
                    strokeWidth={tocProgressStrokeWidth}
                  />

                  {/* progress */}
                  {articleContent != null ? (
                    <TocProgressCircle container={articleContent} />
                  ) : (
                    <motion.circle
                      cx="50"
                      cy="50"
                      r={tocProgressRadius}
                      pathLength="1"
                      className="fill-none stroke-black/70 dark:stroke-white/70"
                      strokeWidth={tocProgressStrokeWidth}
                      strokeLinecap="round"
                      style={{ pathLength: 0 }}
                    />
                  )}
                </svg>
              </figure>
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.span
                  key={activeHeading?.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="block truncate"
                >
                  {activeHeading?.text ?? '目录'}
                </motion.span>
              </AnimatePresence>
            </motion.div>
            <motion.div
              layout="position"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="ml-2 text-muted-foreground"
            >
              {isExpanded ? (
                <TextAlignJustify className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </motion.div>
          </motion.button>

          {/* expanded list */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, gridTemplateRows: '0fr' }}
                animate={{ opacity: 1, gridTemplateRows: '1fr' }}
                exit={{ opacity: 0, gridTemplateRows: '0fr' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative grid before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-black/5 dark:before:bg-white/5"
              >
                <div
                  ref={scrollContainerRef}
                  className="relative max-h-[60vh] min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain [&::-webkit-scrollbar-track]:bg-transparent"
                >
                  <ul className="flex flex-col gap-1 p-2">
                    {headings.map(heading => (
                      <li
                        key={heading.id}
                        style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
                      >
                        <a
                          href={`#${heading.id}`}
                          onClick={e => handleLinkClick(e, heading.id)}
                          className={cn(
                            'block truncate rounded-md px-2 py-1.5 text-sm transition-colors',
                            activeId === heading.id
                              ? 'bg-black/5 font-medium text-foreground dark:bg-white/10'
                              : 'text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5',
                          )}
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>,
    container,
  )
}
