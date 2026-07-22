'use client'

import { motion } from 'motion/react'
import { useRef } from 'react'
import { useTransitionTheme, useVisibilityAnimation } from '@/hooks/animation'
import { FlowerIcon } from './flower-icon'

// * 拖拽两边移动距离阈值，超过触发
// * 移动端拉不了多少...所以调低点，虽然会让 pc 端很容易触发
// * 25 年底才发现，半年前的自己是傻逼了，不知道可以响应式判断嘛...
const threshold = 100
const flowerRotationKeyframes: Keyframe[] = [
  { transform: 'rotate(0deg)' },
  { transform: 'rotate(360deg)' },
]
const flowerAnimationOptions: KeyframeAnimationOptions = {
  duration: 4000,
  iterations: Infinity,
  easing: 'linear',
}

export default function HorizontalDividingLine() {
  const { setTransitionTheme } = useTransitionTheme()
  const flowerRef = useRef<HTMLDivElement>(null)
  const flowerAnimation = useVisibilityAnimation({
    targetRef: flowerRef,
    keyframes: flowerRotationKeyframes,
    options: flowerAnimationOptions,
  })

  return (
    <div className="relative flex w-full items-center justify-center">
      <hr className="absolute left-0 w-[45%] border-theme-indicator border-dashed dark:border-accent-foreground" />
      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
        dragElastic={0.15}
        whileDrag={{ cursor: 'grabbing' }}
        onDragStart={() => {
          flowerAnimation.setPlaybackRate(5)
        }}
        onDragEnd={(_, info) => {
          flowerAnimation.setPlaybackRate(1)
          if (info.offset.x < -threshold) {
            setTransitionTheme('light', { direction: 'left' })
          } else if (info.offset.x > threshold) {
            setTransitionTheme('dark', { direction: 'right' })
          }
        }}
        className="cursor-grab"
      >
        <div ref={flowerRef}>
          <FlowerIcon className="text-theme-indicator dark:text-accent-foreground" />
        </div>
      </motion.div>
      <hr className="absolute right-0 w-[45%] border-theme-indicator border-dashed dark:border-accent-foreground" />
    </div>
  )
}
