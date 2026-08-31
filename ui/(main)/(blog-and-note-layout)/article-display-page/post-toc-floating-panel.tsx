import type { MouseEvent, RefObject } from 'react'
import type { Heading } from './utils/extract-headings'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils/common/shadcn'
import { TocExpandedList } from './post-toc-expanded-list'
import { TocToggleButton } from './post-toc-toggle-button'

export const TocFloatingPanel = ({
  activeHeading,
  activeId,
  articleContent,
  direction,
  headings,
  isExpanded,
  reduceMotion,
  scrollContainerRef,
  onClose,
  onLinkClick,
  onToggle,
}: {
  activeHeading: Heading | undefined
  activeId: string
  articleContent: HTMLElement | null
  direction: number
  headings: Heading[]
  isExpanded: boolean
  reduceMotion: boolean
  scrollContainerRef: RefObject<HTMLDivElement | null>
  onClose: () => void
  onLinkClick: (event: MouseEvent<HTMLAnchorElement>, id: string) => void
  onToggle: () => void
}) => (
  <>
    <AnimatePresence>
      {isExpanded && (
        <motion.button
          type="button"
          aria-label="关闭文章目录"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 cursor-default appearance-none border-0 bg-black/20 p-0 backdrop-blur-sm dark:bg-black/40"
          onClick={onClose}
        />
      )}
    </AnimatePresence>
    <motion.div
      layout
      className={cn(
        'fixed bottom-8 left-1/2 z-50 -translate-x-1/2',
        'bg-theme-background/80 backdrop-blur-sm dark:bg-black/70',
        'border border-[#00000011] dark:border-white/10',
        'shadow-[0_16px_46px_color-mix(in_srgb,var(--theme-accent)_34%,transparent)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.58)]',
        'overflow-hidden',
        'max-w-[90vw]',
        isExpanded ? 'w-[360px]' : 'w-[300px]',
        isExpanded ? 'rounded-2xl' : 'rounded-full',
      )}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.div layout="position" className="flex flex-col">
        <TocToggleButton
          activeHeading={activeHeading}
          articleContent={articleContent}
          direction={direction}
          isExpanded={isExpanded}
          reduceMotion={reduceMotion}
          onClick={onToggle}
        />
        <TocExpandedList
          activeId={activeId}
          headings={headings}
          isExpanded={isExpanded}
          reduceMotion={reduceMotion}
          scrollContainerRef={scrollContainerRef}
          onLinkClick={onLinkClick}
        />
      </motion.div>
    </motion.div>
  </>
)
