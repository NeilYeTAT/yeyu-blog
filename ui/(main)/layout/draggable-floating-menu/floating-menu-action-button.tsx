'use client'

import { type HTMLMotionProps, motion } from 'motion/react'
import { cn } from '@/lib/utils/common/shadcn'

export function FloatingMenuActionButton({ className, ...props }: HTMLMotionProps<'button'>) {
  return (
    <motion.button
      type="button"
      className={cn(
        'relative flex size-9 items-center justify-center rounded-full border border-black/10 bg-theme-surface/80 text-zinc-700 shadow-[0_4px_12px_rgba(24,24,27,0.08)] backdrop-blur-md transition-[color,background-color,border-color,box-shadow] duration-200 hover:border-black/20 hover:bg-white hover:text-black hover:shadow-[0_6px_16px_rgba(24,24,27,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-theme-background dark:border-white/10 dark:bg-black/80 dark:text-zinc-300 dark:shadow-[0_4px_12px_rgba(0,0,0,0.28)] dark:focus-visible:ring-white/45 dark:focus-visible:ring-offset-black dark:hover:border-white/20 dark:hover:bg-zinc-900 dark:hover:text-white',
        className,
      )}
      {...props}
    />
  )
}
