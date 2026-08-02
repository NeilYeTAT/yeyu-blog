'use client'

import type { Variants } from 'motion/react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
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
    transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
  },
}

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
  },
}

export function HomeMotionMain({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.main
      className="flex w-full flex-col items-center justify-center gap-4 pt-16 pb-4"
      initial={shouldReduceMotion ? false : 'hidden'}
      animate="visible"
      variants={containerVariants}
    >
      {children}
    </motion.main>
  )
}

export function HomeAvatarMotion({ children }: { children: ReactNode }) {
  return (
    <motion.div className="flex w-full justify-center" variants={avatarVariants}>
      {children}
    </motion.div>
  )
}

export function HomeBioMotion({ children }: { children: ReactNode }) {
  return (
    <motion.div className="flex w-full justify-center" variants={bioVariants}>
      {children}
    </motion.div>
  )
}

export function HomeFadeMotion({ children }: { children: ReactNode }) {
  return (
    <motion.div className="flex w-full justify-center" variants={fadeVariants}>
      {children}
    </motion.div>
  )
}
