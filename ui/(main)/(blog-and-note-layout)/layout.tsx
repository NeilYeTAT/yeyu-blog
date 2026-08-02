'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function BlogAndNoteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.main
      key={pathname}
      className="flex flex-col px-4"
      initial={shouldReduceMotion ? false : 'hidden'}
      animate="visible"
      variants={containerVariants}
    >
      {children}
    </motion.main>
  )
}
