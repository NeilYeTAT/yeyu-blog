import type { MouseEvent, RefObject } from 'react'
import type { Heading } from './utils/extract-headings'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils/common/shadcn'

const layerTransition = { duration: 0.24, ease: [0.65, 0, 0.35, 1] } as const

export const TocExpandedList = ({
  activeId,
  headings,
  isExpanded,
  reduceMotion,
  scrollContainerRef,
  onLinkClick,
}: {
  activeId: string
  headings: Heading[]
  isExpanded: boolean
  reduceMotion: boolean
  scrollContainerRef: RefObject<HTMLDivElement | null>
  onLinkClick: (event: MouseEvent<HTMLAnchorElement>, id: string) => void
}) => (
  <AnimatePresence>
    {isExpanded && (
      <motion.div
        initial={{
          opacity: 0,
          gridTemplateRows: '0fr',
          filter: reduceMotion ? 'blur(0px)' : 'blur(3px)',
        }}
        animate={{ opacity: 1, gridTemplateRows: '1fr', filter: 'blur(0px)' }}
        exit={{
          opacity: 0,
          gridTemplateRows: '0fr',
          filter: reduceMotion ? 'blur(0px)' : 'blur(3px)',
        }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                gridTemplateRows: {
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                },
                opacity: layerTransition,
                filter: layerTransition,
              }
        }
        className="relative grid before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-black/5 dark:before:bg-white/5"
      >
        <div
          ref={scrollContainerRef}
          className="relative max-h-[60vh] min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain [&::-webkit-scrollbar-track]:bg-transparent"
        >
          <ul className="flex flex-col gap-1 p-2">
            {headings.map(heading => (
              <li key={heading.id} style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}>
                <a
                  href={`#${heading.id}`}
                  onClick={event => onLinkClick(event, heading.id)}
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
)
