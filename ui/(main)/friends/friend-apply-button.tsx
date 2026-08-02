'use client'

import type { Variants } from 'motion/react'
import { motion } from 'motion/react'
import { useModalActions } from '@/store/use-modal-store'

const buttonVariants: Variants = {
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

export function FriendApplyButton() {
  const { setModalOpen } = useModalActions()

  return (
    <motion.button
      type="button"
      initial="hidden"
      animate="visible"
      variants={buttonVariants}
      onClick={() => {
        setModalOpen('friendLinkApplyModal')
      }}
      className="inline-flex h-9 shrink-0 cursor-pointer items-center rounded-lg border border-[#00000011] bg-theme-background/80 px-3 font-medium text-sm text-zinc-900 transition-colors hover:border-black/15 focus-visible:outline-2 focus-visible:outline-theme-ring dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-700"
    >
      申请友链
    </motion.button>
  )
}
