'use client'

import type { JSX } from 'react'
import {
  motion,
  type MotionStyle,
  useAnimationFrame,
  useMotionValue,
  useSpring,
} from 'motion/react'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import { HoverCard } from '@/ui/components/shared/hover-card'
// * svg
import GolangIcon from './assets/golang-icon.svg'
import NestjsIcon from './assets/nestjs-icon.svg'
import NextjsIcon from './assets/nextjs-icon.svg'
import ReactIcon from './assets/react-icon.svg'
import TailwindcssIcon from './assets/tailwindcss-icon.svg'
import TypeScriptIcon from './assets/typescript-icon.svg'
import VimIcon from './assets/vim-icon.svg'

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
    component: <Image src={TypeScriptIcon} alt="TypeScript" className="size-full" />,
    name: 'TypeScript',
    insight: '最喜欢的编程语言，选择 ts 全栈开发，让 ts 再次伟大🙌🏻',
    color: '#3178c6',
  },
  {
    key: 'react',
    component: <Image src={ReactIcon} alt="React" className="size-full" />,
    name: 'React',
    insight: 'jsx/tsx 语法顶级，但 useEffect 确实不好用，也容易被人滥用性能优化的那些 hook😅',
    color: '#61dafb',
  },
  {
    key: 'tailwindcss',
    component: <Image src={TailwindcssIcon} alt="Tailwind CSS" className="size-full" />,
    name: 'Tailwind CSS',
    insight: '神中神👍🏻，没有 tailwindcss 根本不想写前端',
    color: '#38bdf8',
  },
  {
    key: 'next',
    component: <Image src={NextjsIcon} alt="Next.js" className="size-full" />,
    name: 'Next.js',
    insight: 'MacBook air m4 24g 都顶不住，你他妈的怎么能这么卡🤬',
    color: '#000000',
  },
  {
    key: 'go',
    component: <Image src={GolangIcon} alt="Go" className="size-full" />,
    name: 'Go',
    insight:
      '哥们当年差点就去转 Go 后端了，不过现在暂时先选择放弃 Go 了，语法丑陋得一批🥹，但是我很喜欢',
    color: '#00add8',
  },
  {
    key: 'nest',
    component: <Image src={NestjsIcon} alt="NestJS" className="size-full" />,
    name: 'NestJS',
    insight: '还在学习中...暂时还觉得挺优雅',
    color: '#e0234e',
  },
  {
    key: 'vim',
    component: <Image src={VimIcon} alt="Vim" className="size-full" />,
    name: 'Vim',
    insight: '编辑器之神，虽然我是 vscode + vim 插件，不够纯粹🥹',
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
                '--r': 'max(var(--min-r), calc((var(--n) * var(--view-w) / 3.5) / 6.28))',
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
                  `absolute left-1/2 z-10 size-16 -translate-x-1/2 drop-shadow-[0_0_0.75rem_#211C84] transition hover:cursor-pointer md:size-32 dark:drop-shadow-[0_0_0.75rem_#006A71]`,
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
