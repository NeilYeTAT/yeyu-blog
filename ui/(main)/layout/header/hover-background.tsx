import type { FC } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'

export const HoverBackground: FC<{ isVisible: boolean }> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          layoutId="hoverBackground"
          className="absolute -inset-x-1 -inset-y-0.5 -z-10 rounded-full bg-white/60 shadow-sm dark:bg-neutral-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        />
      )}
    </AnimatePresence>
  )
}
