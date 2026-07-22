import type { FC } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

export const HoverBackground: FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          layoutId="hoverBackground"
          className="absolute -inset-x-1 -inset-y-0.5 -z-10 rounded-full bg-white/60 shadow-sm dark:bg-neutral-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  layout: { type: 'spring', stiffness: 450, damping: 38 },
                  opacity: { duration: 0.1 },
                }
          }
        />
      )}
    </AnimatePresence>
  )
}
