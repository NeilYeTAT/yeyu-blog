'use client'

import type { JSX } from 'react'
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
  return (
    <div>
      {/* 尺子量的~ */}
      <section className="animate-ye-spin-slowly relative size-62.5 rounded-full md:size-125">
        {techStackSvg.map((svg, i) => (
          <div
            key={svg.key}
            className={cn(
              `absolute left-1/2 z-10 size-1/4 origin-[center_125px] -translate-x-1/2 drop-shadow-[0_0_0.75rem_#211C84] transition hover:cursor-pointer md:size-32 md:origin-[center_250px] dark:drop-shadow-[0_0_0.75rem_#006A71]`,
            )}
            style={{
              transform: `rotate(${i * (360 / techStackSvg.length)}deg)`,
            }}
          >
            {svg}
          </div>
        ))}
      </section>
    </div>
  )
}

export default TechStack
