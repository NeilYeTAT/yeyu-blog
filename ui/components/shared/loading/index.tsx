// * motion 付费组件~
// * import from  https://examples.motion.dev/react/loading-ripple
'use client'

import type { Transition } from 'motion/react'
import { motion } from 'motion/react'

export default function Loading() {
  const animation = {
    transform: ['scale(0)', 'scale(1)'],
    opacity: [1, 0],
  }

  const transition: Transition = {
    duration: 2,
    repeat: Infinity,
    ease: 'easeOut',
  }

  return (
    <div className="container m-auto">
      <div className="ripple-container">
        <motion.div className="ripple" animate={animation} transition={transition} />
        <motion.div
          className="ripple"
          animate={animation}
          transition={{
            ...transition,
            delay: 0.5,
          }}
        />
        <motion.div
          className="ripple"
          animate={animation}
          transition={{
            ...transition,
            delay: 1,
          }}
        />
      </div>
      <StyleSheet />
    </div>
  )
}

/**
 * ==============   Styles   ================
 */
function StyleSheet() {
  return (
    <style>
      {`
            .container {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .ripple-container {
                position: relative;
                width: 100px;
                height: 100px;
            }

            .ripple {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: 50%;
                border: 4px solid #09090b;
                will-change: transform, opacity;
                opacity: 0;
            }

            .dark .ripple {
                border-color: #fafafa;
            }
            `}
    </style>
  )
}
