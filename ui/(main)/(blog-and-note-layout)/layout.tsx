'use client'

import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { useIsPanelOpening } from '@/store/use-startup-store'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function BlogAndNoteLayout({ children }: { children: ReactNode }) {
  const isPanelOpening = useIsPanelOpening()

  return (
    <motion.main
      className="flex flex-col px-4"
      initial="hidden"
      animate={isPanelOpening ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {children}
    </motion.main>
  )
}
