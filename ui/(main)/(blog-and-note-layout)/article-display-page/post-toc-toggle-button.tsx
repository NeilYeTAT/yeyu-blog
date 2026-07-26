import type { Heading } from './utils/extract-headings'
import { ChevronDown, TextAlignJustify } from 'lucide-react'
import { AnimatePresence, motion, useScroll } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils/common/shadcn'

const variants = {
  enter: ({ direction, reduceMotion }: { direction: number; reduceMotion: boolean }) => ({
    y: reduceMotion ? 0 : direction * 8,
    opacity: 0,
    filter: reduceMotion ? 'blur(0px)' : 'blur(4px)',
  }),
  center: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: ({ direction, reduceMotion }: { direction: number; reduceMotion: boolean }) => ({
    y: reduceMotion ? 0 : direction * -8,
    opacity: 0,
    filter: reduceMotion ? 'blur(0px)' : 'blur(4px)',
  }),
}

const labelTransition = { duration: 0.2, ease: [0.22, 1, 0.36, 1] } as const
const tocProgressRadius = 34
const tocProgressStrokeWidth = 10

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
      style={{ pathLength: scrollYProgress }}
    />
  )
}

export const TocToggleButton = ({
  activeHeading,
  articleContent,
  direction,
  isExpanded,
  reduceMotion,
  onClick,
}: {
  activeHeading: Heading | undefined
  articleContent: HTMLElement | null
  direction: number
  isExpanded: boolean
  reduceMotion: boolean
  onClick: () => void
}) => (
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
    onClick={onClick}
  >
    <motion.div className="relative flex max-w-75 items-center justify-between gap-1 truncate font-medium text-sm">
      <figure className="flex items-center justify-center">
        <svg height={28} width={28} viewBox="0 0 100 100" className="-rotate-90">
          <circle
            cx="50"
            cy="50"
            r={tocProgressRadius}
            pathLength="1"
            className="fill-none stroke-black/10 dark:stroke-white/10"
            strokeWidth={tocProgressStrokeWidth}
          />
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
      <AnimatePresence mode="popLayout" initial={false} custom={{ direction, reduceMotion }}>
        <motion.span
          key={activeHeading?.id}
          custom={{ direction, reduceMotion }}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={reduceMotion ? { duration: 0 } : labelTransition}
          className="block truncate"
        >
          {activeHeading?.text ?? '目录'}
        </motion.span>
      </AnimatePresence>
    </motion.div>
    <motion.div
      layout="position"
      animate={{ rotate: isExpanded ? 180 : 0 }}
      transition={reduceMotion ? { duration: 0 } : labelTransition}
      className="ml-2 size-4 shrink-0 text-muted-foreground"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {isExpanded ? (
          <motion.span
            key="expanded"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(3px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(3px)' }}
            transition={reduceMotion ? { duration: 0 } : labelTransition}
            className="block size-4"
          >
            <TextAlignJustify className="size-4" />
          </motion.span>
        ) : (
          <motion.span
            key="collapsed"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(3px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(3px)' }}
            transition={reduceMotion ? { duration: 0 } : labelTransition}
            className="block size-4"
          >
            <ChevronDown className="size-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  </motion.button>
)
