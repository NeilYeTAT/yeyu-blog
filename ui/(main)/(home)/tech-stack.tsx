'use client'

import type { JSX } from 'react'
import { motion, useAnimationFrame, useMotionValue, useSpring } from 'motion/react'
import GolangSvg from '@/config/svg/golang-svg'
import NextjsSvg from '@/config/svg/nextjs-svg'
import ReactSvg from '@/config/svg/reactjs-svg'
import TailwindcssSvg from '@/config/svg/tailwindcss-svg'
import TypeScriptSvg from '@/config/svg/typescript-svg'
import VueSvg from '@/config/svg/vuejs-svg'
import { cn } from '@/lib/utils/common/shadcn'

const techStackSvg: JSX.Element[] = [
  <VueSvg key="vue" />,
  <TypeScriptSvg key="ts" />,
  <ReactSvg key="react" />,
  <TailwindcssSvg key="tailwindcss" />,
  <NextjsSvg key="next" />,
  <GolangSvg key="go" />,
]

function TechStack() {
  const rotation = useMotionValue(0)
  const speed = useSpring(1, { stiffness: 40, damping: 20 })

  useAnimationFrame((_time, delta) => {
    const currentRotation = rotation.get()
    const currentSpeed = speed.get()
    // 360 degrees in 24 seconds (24000 ms)
    const baseSpeed = 360 / 24000
    rotation.set(currentRotation + baseSpeed * delta * currentSpeed)
  })

  return (
    <div className="flex h-35 justify-center overflow-hidden mask-[linear-gradient(to_bottom,black_70%,transparent_100%)] pt-10 md:mt-20 md:h-70">
      <motion.section
        style={{ rotate: rotation }}
        className="relative size-80 rounded-full md:size-160"
      >
        {techStackSvg.map((svg, i) => (
          <motion.div
            key={svg.key}
            onHoverStart={() => speed.set(0)}
            onHoverEnd={() => speed.set(1)}
            className={cn(
              `absolute left-1/2 z-10 size-16 origin-[center_160px] -translate-x-1/2 drop-shadow-[0_0_0.75rem_#211C84] transition hover:cursor-pointer md:size-32 md:origin-[center_320px] dark:drop-shadow-[0_0_0.75rem_#006A71]`,
            )}
            style={{
              rotate: i * (360 / techStackSvg.length),
            }}
          >
            {svg}
          </motion.div>
        ))}
      </motion.section>
    </div>
  )
}

export default TechStack
