'use client'

import { motion, useScroll } from 'motion/react'

export default function ScrollIndicator({
  backgroundColor = `#7886C7`,
}: {
  backgroundColor?: string
}) {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 11,
        originX: 0,
        backgroundColor,
        zIndex: 10,
      }}
    />
  )
}
