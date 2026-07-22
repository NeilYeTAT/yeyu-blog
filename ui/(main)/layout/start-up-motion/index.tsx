'use client'

import { animate, motion, useMotionValue } from 'motion/react'
import { useEffect, useRef } from 'react'
import { useStartupStore } from '@/store/use-startup-store'
import { startupEase, startupPanelDelay, startupPanelDuration } from './constant'

const lineDuration = 0.96
const welcomeTextChars = [
  { id: 'ye', value: '业' },
  { id: 'yu', value: '余' },
]

export default function StartUpMotion() {
  const setPanelOpening = useStartupStore(s => s.setPanelOpening)
  const setAnimationComplete = useStartupStore(s => s.setAnimationComplete)
  const rootRef = useRef<HTMLDivElement>(null)
  const scaleY = useMotionValue(0)

  const toLeft = useMotionValue('0%')
  const toRight = useMotionValue('0%')

  useEffect(() => {
    const lineAnimation = animate(scaleY, [0, 1, 0.72, 0], {
      duration: lineDuration,
      times: [0, 0.46, 0.64, 1],
      ease: startupEase,
    })

    const leftPanelAnimation = animate(toLeft, '-100%', {
      duration: startupPanelDuration,
      ease: startupEase,
      delay: startupPanelDelay,
    })

    const rightPanelAnimation = animate(toRight, '100%', {
      duration: startupPanelDuration,
      ease: startupEase,
      delay: startupPanelDelay,
      onComplete: () => {
        rootRef.current?.setAttribute('hidden', '')
        setAnimationComplete(true)
      },
    })
    const panelOpeningTimer = window.setTimeout(() => {
      setPanelOpening(true)
    }, startupPanelDelay * 1000)

    return () => {
      window.clearTimeout(panelOpeningTimer)
      lineAnimation.stop()
      leftPanelAnimation.stop()
      rightPanelAnimation.stop()
    }
  }, [scaleY, setAnimationComplete, setPanelOpening, toLeft, toRight])

  return (
    <div ref={rootRef}>
      <motion.span
        className="pointer-events-none fixed top-2/3 left-1/2 z-110 h-dvh w-px -translate-x-1/2 bg-white"
        style={{ scaleY }}
      />
      <motion.span
        className="pointer-events-none fixed bottom-2/3 left-1/2 z-110 h-dvh w-px -translate-x-1/2 bg-white"
        style={{ scaleY }}
      />

      <motion.div
        className="pointer-events-none fixed top-1/2 left-1/2 z-110 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-5xl text-purple-200 leading-none"
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{
          opacity: [0, 1, 1, 0],
          y: [12, 0, 0, -8],
          scale: [0.96, 1, 1, 0.98],
        }}
        transition={{
          duration: 0.96,
          times: [0, 0.09, 0.66, 1],
          ease: startupEase,
        }}
      >
        {welcomeTextChars.map((char, index) => (
          <motion.span
            key={char.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -6] }}
            transition={{
              duration: 0.88,
              times: [0, 0.09, 0.72, 1],
              ease: startupEase,
              delay: index * 0.02,
            }}
          >
            {char.value}
          </motion.span>
        ))}
      </motion.div>

      <motion.span
        className="pointer-events-none fixed top-0 left-0 z-100 h-dvh w-1/2 bg-linear-to-r from-[#22177A] to-[#000957] [backface-visibility:hidden]"
        style={{ x: toLeft }}
      />
      <motion.span
        className="pointer-events-none fixed top-0 right-0 z-100 h-dvh w-1/2 bg-linear-to-l from-[#22177A] to-[#000957] [backface-visibility:hidden]"
        style={{ x: toRight }}
      />
    </div>
  )
}
