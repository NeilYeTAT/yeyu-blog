'use client'

import { motion, useAnimationFrame, useMotionValue } from 'motion/react'
import { useState } from 'react'
import Mandala from '@/config/svg/mandala'
import { useTransitionTheme } from '@/lib/hooks/animation'

// * 拖拽两边移动距离阈值，超过触发
// * 移动端拉不了多少...所以调低点，虽然会让 pc 端很容易触发
// * 25 年底才发现，半年前的自己是傻逼了，不知道可以响应式判断嘛...
const THRESHOLD = 100

export default function HorizontalDividingLine({
  fill = '#6FC3C4',
  dividerColor = '',
}: {
  fill?: string
  dividerColor?: string
}) {
  const { setTransitionTheme } = useTransitionTheme()
  const rotate = useMotionValue(0)
  const [duration, setDuration] = useState(4)

  useAnimationFrame((_, delta) => {
    rotate.set(rotate.get() + (360 * delta) / (duration * 1000))
  })

  const borderColor = dividerColor !== '' ? dividerColor : undefined

  return (
    <div className="relative flex w-full items-center justify-center">
      <hr
        className="dark:border-accent absolute left-0 w-[45%] border-dashed border-indigo-500"
        style={{ borderColor }}
      />
      <motion.div
        style={{ rotate }}
        drag="x"
        dragDirectionLock
        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
        dragElastic={0.15}
        whileDrag={{ cursor: 'grabbing' }}
        onDragStart={() => setDuration(0.8)}
        onDragEnd={(event, info) => {
          setDuration(4)
          if (info.offset.x < -THRESHOLD) {
            setTransitionTheme('light', 'left')
          } else if (info.offset.x > THRESHOLD) {
            setTransitionTheme('dark', 'right')
          }
        }}
      >
        <Mandala className="size-10 cursor-grabbing" fill={fill} />
      </motion.div>
      <hr
        className="dark:border-accent absolute right-0 w-[45%] border-dashed border-indigo-500"
        style={{ borderColor }}
      />
    </div>
  )
}
