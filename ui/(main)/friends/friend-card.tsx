import type { Variants } from 'motion/react'
import type { Friend } from './types'
import * as motion from 'motion/react-client'
import Link from 'next/link'
import { cn } from '@/lib/utils/common/shadcn'
import { FriendAvatarImage } from './friend-avatar-image'

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: [30, -8, 0] as number[],
    transition: {
      type: 'tween' as const,
      ease: 'easeInOut',
      duration: 0.8,
    },
  },
}

export function FriendCard({
  friend,
  index,
  isVisible,
  onViewportEnter,
}: {
  friend: Friend
  index: number
  isVisible: boolean
  onViewportEnter: () => void
}) {
  const isRightAligned = index % 2 === 1

  return (
    <motion.li
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      onViewportEnter={onViewportEnter}
      viewport={{ amount: 0.4, once: true }}
      variants={cardVariants}
      className={cn('flex w-[80%] md:w-[60%]', isRightAligned && 'self-end')}
    >
      <Link
        href={friend.siteUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`访问 ${friend.name} 的网站`}
        className={cn(
          'flex h-[72px] w-full items-center gap-2 rounded-xl border border-[#00000011] bg-theme-background/80 px-3 py-1.5 text-left text-zinc-900 transition-colors hover:border-black/15 focus-visible:outline-2 focus-visible:outline-theme-ring md:h-20 md:gap-3 md:px-4 md:py-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-700',
          isRightAligned && 'flex-row-reverse text-right',
        )}
      >
        <FriendAvatarImage avatarUrl={friend.avatarUrl} name={friend.name} />

        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-sm text-zinc-900 md:text-base dark:text-zinc-100">
            {friend.name}
          </span>
          <span className="mt-1 block truncate text-[11px] text-zinc-500 leading-4 md:text-xs md:leading-5 dark:text-zinc-400">
            {friend.description}
          </span>
        </span>
      </Link>
    </motion.li>
  )
}
