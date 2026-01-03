'use client'

import { Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent } from 'motion/react'
import Image from 'next/image'
import { useState } from 'react'
import avatar from '@/config/img/avatar.webp'
import { useTransitionTheme } from '@/lib/hooks/animation'
import { cn } from '@/lib/utils/common/shadcn'

export default function YeAvatar() {
  const { setTransitionTheme } = useTransitionTheme()
  const [isDragging, setIsDragging] = useState(false)
  const [activeIcon, setActiveIcon] = useState<string | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const checkProximity = (currX: number, currY: number) => {
    const threshold = 100
    const targets = {
      tl: { x: -100, y: -30 },
      tr: { x: 100, y: -30 },
      bl: { x: -100, y: 30 },
      br: { x: 100, y: 30 },
    }

    let closest = null
    let minDist = Infinity

    for (const [key, pos] of Object.entries(targets)) {
      const dist = Math.sqrt(Math.pow(currX - pos.x, 2) + Math.pow(currY - pos.y, 2))
      if (dist < minDist) {
        minDist = dist
        closest = key
      }
    }

    if (minDist < threshold && closest !== null) {
      setActiveIcon(closest)
    } else {
      setActiveIcon(null)
    }
  }

  useMotionValueEvent(x, 'change', latest => checkProximity(latest, y.get()))
  useMotionValueEvent(y, 'change', latest => checkProximity(x.get(), latest))

  return (
    <div className="relative">
      <AnimatePresence>
        {isDragging && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0, x: 30, y: 10 }}
              animate={{
                opacity: 1,
                scale: activeIcon === 'tl' ? 1.5 : 1,
                x: 0,
                y: 0,
              }}
              exit={{ opacity: 0, scale: 0, x: 30, y: 10 }}
              className={`absolute -top-4 -left-20 z-50 size-8 rounded-full bg-[#7AB2B2] dark:bg-emerald-300 ${activeIcon === 'tl' ? 'ring-4 ring-white dark:ring-gray-800' : ''}`}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0, x: -30, y: 10 }}
              animate={{
                opacity: 1,
                scale: activeIcon === 'tr' ? 1.5 : 1,
                x: 0,
                y: 0,
              }}
              exit={{ opacity: 0, scale: 0, x: -30, y: 10 }}
              className={`absolute -top-4 -right-20 z-50 size-8 rounded-full bg-[#7AB2B2] dark:bg-emerald-300 ${activeIcon === 'tr' ? 'ring-4 ring-white dark:ring-gray-800' : ''}`}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0, x: 30, y: -10 }}
              animate={{
                opacity: 1,
                scale: activeIcon === 'bl' ? 1.5 : 1,
                x: 0,
                y: 0,
              }}
              exit={{ opacity: 0, scale: 0, x: 30, y: -10 }}
              className={cn(
                'absolute -bottom-4 -left-20 z-50 size-8 rounded-full',
                activeIcon === 'bl' && 'ring-2 ring-white dark:ring-gray-800',
              )}
            >
              <Sun className="m-auto" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0, x: -30, y: -10 }}
              animate={{
                opacity: 1,
                scale: activeIcon === 'br' ? 1.5 : 1,
                x: 0,
                y: 0,
              }}
              exit={{ opacity: 0, scale: 0, x: -30, y: -10 }}
              className={cn(
                'absolute -right-20 -bottom-4 z-50 flex size-8 rounded-full',
                activeIcon === 'br' && 'ring-2 ring-white dark:ring-gray-800',
              )}
            >
              <Moon className="m-auto" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 摸摸头~ */}
      {/* * 拍拍头切换亮暗模式~ */}
      <motion.figure
        // TODO: config color
        className="relative cursor-grab drop-shadow-2xl active:drop-shadow-[#7AB2B2] dark:active:drop-shadow-emerald-300"
        whileTap={{ scale: 0.99, rotate: 1 }}
        drag
        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
        dragElastic={0.2}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        onDragEnd={() => {
          setIsDragging(false)
          if (activeIcon === 'bl') {
            setTransitionTheme('light', { direction: 'left', duration: 300 })
          } else if (activeIcon === 'br') {
            setTransitionTheme('dark', { direction: 'left', duration: 300 })
          }
        }}
        style={{ x, y }}
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
