'use client'

import type { Variants } from 'motion/react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useInitialPageTransition } from '../layout/initial-page-transition-context'

const homeVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.04,
      staggerChildren: 0.12,
    },
  },
}

const textVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: [0.16, 1, 0.3, 1] },
  },
}

export function HomeMotion({ children }: { children: ReactNode }) {
  const isPageRevealing = useInitialPageTransition()
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className="contents"
      initial={shouldReduceMotion ? false : 'hidden'}
      animate={isPageRevealing || shouldReduceMotion ? 'visible' : 'hidden'}
      variants={homeVariants}
    >
      {children}
    </motion.div>
  )
}

export function HomeTextMotion({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div className={className} variants={textVariants}>
      {children}
    </motion.div>
  )
}
