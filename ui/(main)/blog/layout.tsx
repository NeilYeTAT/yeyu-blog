'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/ui/components/provider/main/language-provider'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function BlogLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()
  const { isLanguageChanging } = useLanguage()

  return (
    <motion.main
      key={pathname}
      className="flex flex-col px-4"
      initial={shouldReduceMotion || isLanguageChanging ? false : 'hidden'}
      animate="visible"
      variants={containerVariants}
    >
      {children}
    </motion.main>
  )
}
