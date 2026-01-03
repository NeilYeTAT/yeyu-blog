'use client'

import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useState } from 'react'
import avatar from '@/config/img/avatar.webp'
import { useTransitionTheme } from '@/lib/hooks/animation'

export default function YeAvatar() {
  const { setTransitionTheme, theme } = useTransitionTheme()
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div className="relative">
      <AnimatePresence>
        {isDragging && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0, x: 30, y: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0, x: 30, y: 10 }}
              className="absolute -top-4 -left-20 z-50 size-8 rounded-full bg-[#7AB2B2] dark:bg-emerald-300"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0, x: -30, y: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0, x: -30, y: 10 }}
              className="absolute -top-4 -right-20 z-50 size-8 rounded-full bg-[#7AB2B2] dark:bg-emerald-300"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0, x: 30, y: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0, x: 30, y: -10 }}
              className="absolute -bottom-4 -left-20 z-50 size-8 rounded-full bg-[#7AB2B2] dark:bg-emerald-300"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0, x: -30, y: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0, x: -30, y: -10 }}
              className="absolute -right-20 -bottom-4 z-50 size-8 rounded-full bg-[#7AB2B2] dark:bg-emerald-300"
            />
          </>
        )}
      </AnimatePresence>

      {/* 摸摸头~ */}
      {/* * 拍拍头切换亮暗模式~ */}
      <motion.figure
        // TODO: config color
        className="relative cursor-grab drop-shadow-2xl active:drop-shadow-[#7AB2B2] dark:active:drop-shadow-emerald-300"
        onDoubleClick={() => setTransitionTheme(theme === 'light' ? 'dark' : 'light')}
        whileTap={{ scale: 0.99, rotate: 1 }}
        drag
        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
        dragElastic={0.2}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        onDragEnd={() => setIsDragging(false)}
      >
        <Image
          src={avatar}
          alt="avatar"
          className="w-44 rounded-full md:w-52"
          placeholder="blur"
          priority
        />
        <span className="animate-ye-ping-one-dot-one absolute top-0 left-0 size-full rounded-full ring-4 ring-[#7ac7b9] ring-offset-1 dark:ring-blue-800" />
      </motion.figure>
    </div>
  )
}
