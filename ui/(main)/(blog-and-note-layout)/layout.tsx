import type React from 'react'
import * as motion from 'motion/react-client'

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
    <motion.main
      className="flex flex-col px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.main>
  )
}
