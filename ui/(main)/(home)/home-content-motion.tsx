'use client'

import type { ReactNode } from 'react'
import { domAnimation, LazyMotion, m, type Variants } from 'motion/react'
import { useStartupStore } from '@/store/use-startup-store'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
}

const avatarVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
}

const bioVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
}

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

export function HomeMotionMain({ children }: { children: ReactNode }) {
  const isAnimationComplete = useStartupStore(s => s.isAnimationComplete)

  return (
    <LazyMotion features={domAnimation}>
      <m.main
        className="flex w-full flex-col items-center justify-center gap-4 pt-16 pb-4"
        initial="hidden"
        animate={isAnimationComplete ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        {children}
      </m.main>
    </LazyMotion>
  )
}

export function HomeAvatarMotion({ children }: { children: ReactNode }) {
  return (
    <m.div variants={avatarVariants} className="flex w-full justify-center">
      {children}
    </m.div>
  )
}

export function HomeBioMotion({ children }: { children: ReactNode }) {
  return (
    <m.div variants={bioVariants} className="flex w-full justify-center">
      {children}
    </m.div>
  )
}

export function HomeFadeMotion({ children }: { children: ReactNode }) {
  return (
    <m.div variants={fadeVariants} className="flex w-full justify-center">
      {children}
    </m.div>
  )
}
