'use client'

import type { JSX } from 'react'
import {
  motion,
  type MotionStyle,
  useAnimationFrame,
  useMotionValue,
  useSpring,
} from 'motion/react'
import { useState } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import { HoverCard } from '@/ui/components/shared/hover-card'
// * svg
import {
  // GolangIcon,
  NestjsIcon,
  NextjsIcon,
  ReactIcon,
  TailwindcssIcon,
  TypeScriptIcon,
  VimIcon,
} from './assets/svg'

type TechItem = {
  key: string
  component: JSX.Element
  name: string
  insight: string
  color?: string
}

const techStackData: TechItem[] = [
  {
    key: 'ts',
    component: <TypeScriptIcon className="size-full" />,
    name: 'TypeScript',
    insight: '最喜欢的编程语言 ⸜( ^ ᵕ ^ )⸝♡',
    color: '#3178c6',
  },
  {
    key: 'react',
    component: <ReactIcon className="size-full" />,
    name: 'React',
    insight: `tsx/jsx 语法顶级 ⸜(꒪'꒳'꒪)⸝`,
    color: '#61dafb',
  },
  {
    key: 'tailwindcss',
    component: <TailwindcssIcon className="size-full" />,
    name: 'Tailwind CSS',
    insight: '神中神中神 ( ˶ｰ̀֊ｰ́ )੭',
    color: '#38bdf8',
  },
  {
    key: 'next',
    component: <NextjsIcon className="size-full dark:invert" />,
    name: 'Next.js',
    insight: '开发时的性能问题和偶尔的漏洞有点坑 ( •ᴗ•̥ ˳ )',
    color: '#000000',
  },
  // {
  //   key: 'go',
  //   component: <GolangIcon className="size-full" />,
  //   name: 'Go',
  //   insight: '语法丑陋，但我也忘完了 (´•ω•̥`)',
  //   color: '#00add8',
  // },
  {
    key: 'nest',
    component: <NestjsIcon className="size-full" />,
    name: 'NestJS',
    insight: '架构整洁合理 ( •̀-•́ゞ)',
    color: '#e0234e',
  },
  {
    key: 'vim',
    component: <VimIcon className="size-full" />,
    name: 'Vim',
    insight: `配合 vscode 使用很爽 ･ᴗ･ )੭''`,
    color: '#019733',
  },
]

function TechStack() {
  const rotation = useMotionValue(0)
  const speed = useSpring(1, { stiffness: 40, damping: 20 })
  const [hoveredItem, setHoveredItem] = useState<TechItem | null>(null)

  useAnimationFrame((_time, delta) => {
    const currentRotation = rotation.get()
    const currentSpeed = speed.get()
    // 360 degrees in 24 seconds (24000 ms)
    const baseSpeed = 360 / 24000
    rotation.set(currentRotation + baseSpeed * delta * currentSpeed)
  })

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <HoverCard
        show={hoveredItem !== null}
        title={hoveredItem !== null ? hoveredItem.name : ''}
        description={hoveredItem !== null ? hoveredItem.insight : ''}
        icon={hoveredItem?.component}
        color={hoveredItem?.color}
        className="absolute top-0 right-4 hidden md:block"
      />
      <div className="flex h-35 justify-center overflow-hidden mask-[linear-gradient(to_bottom,black_70%,transparent_100%)] md:mt-20 md:h-70">
        <div className="flex w-full justify-center mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] pt-10">
          <motion.section
            style={
              {
                rotate: rotation,
                width: 'calc(var(--r) * 2)',
                height: 'calc(var(--r) * 2)',
                '--n': techStackData.length,
                '--r': `max(var(--min-r), calc((var(--n) * var(--view-w) / ${techStackData.length > 5 ? 4 : 3}) / 6.28))`,
              } as MotionStyle
            }
            className="relative rounded-full [--min-r:160px] [--s:64px] [--view-w:100vw] md:[--min-r:320px] md:[--s:128px] md:[--view-w:64rem]"
          >
            {techStackData.map((item, i) => (
              <motion.div
                key={item.key}
                onHoverStart={() => {
                  speed.set(0)
                  setHoveredItem(item)
                }}
                onHoverEnd={() => {
                  speed.set(1)
                  setHoveredItem(null)
                }}
                className={cn(
                  `absolute left-1/2 z-10 size-16 -translate-x-1/2 drop-shadow-[0_0_10px_#1babbb] transition hover:cursor-pointer md:size-32 dark:drop-shadow-[0_0_10px_#c0c0c0]`,
                )}
                style={{
                  rotate: i * (360 / techStackData.length),
                  transformOrigin: 'center var(--r)',
                }}
              >
                {item.component}
              </motion.div>
            ))}
          </motion.section>
        </div>
      </div>
    </div>
  )
}

export default TechStack
