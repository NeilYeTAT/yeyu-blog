import type React from 'react'
import * as m from 'motion/react-m'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function BlogAndNoteLayout({ children }: { children: React.ReactNode }) {
  return (
    <m.main
      className="flex flex-col px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </m.main>
  )
}
