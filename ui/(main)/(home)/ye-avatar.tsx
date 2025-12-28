'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import avatar from '@/config/img/avatar.webp'
import { useTransitionTheme } from '@/lib/hooks/animation'

export default function YeAvatar() {
  const { setTransitionTheme, theme } = useTransitionTheme()

  return (
    // 摸摸头~
    // * 拍拍头切换亮暗模式~
    <motion.figure
      // TODO: config color
      className="relative cursor-grab drop-shadow-2xl active:drop-shadow-[#7AB2B2] dark:active:drop-shadow-emerald-300"
      onDoubleClick={() => setTransitionTheme(theme === 'light' ? 'dark' : 'light')}
      whileTap={{ scale: 0.99, rotate: 1 }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
      dragElastic={0.2}
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
  )
}
