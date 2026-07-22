'use client'

import type { CSSProperties, ReactNode } from 'react'
import { useRef } from 'react'
import { useVisibilityAnimation } from '@/hooks/animation/use-visibility-animation'
import { useStartupStore } from '@/store/use-startup-store'

const outerRotationKeyframes: Keyframe[] = [
  { transform: 'rotate(0deg)' },
  { transform: 'rotate(360deg)' },
]
const innerRotationKeyframes: Keyframe[] = [
  { transform: 'rotate(0deg)' },
  { transform: 'rotate(-360deg)' },
]
const ringAnimationOptions: KeyframeAnimationOptions = {
  duration: 24000,
  iterations: Infinity,
  easing: 'linear',
}

export function TechStackRings({
  outerItems,
  innerItems,
  ringBaseCount,
}: {
  outerItems: { key: string; component: ReactNode }[]
  innerItems: { key: string; component: ReactNode }[]
  ringBaseCount: number
}) {
  const isAnimationComplete = useStartupStore(s => s.isAnimationComplete)
  const outerRingRef = useRef<HTMLDivElement>(null)
  const innerRingRef = useRef<HTMLDivElement>(null)
  const outerAnimation = useVisibilityAnimation({
    targetRef: outerRingRef,
    keyframes: outerRotationKeyframes,
    options: ringAnimationOptions,
    enabled: isAnimationComplete,
  })
  const innerAnimation = useVisibilityAnimation({
    targetRef: innerRingRef,
    keyframes: innerRotationKeyframes,
    options: ringAnimationOptions,
    enabled: isAnimationComplete,
  })

  const stopRotation = () => {
    outerAnimation.pause(800)
    innerAnimation.pause(800)
  }

  const startRotation = () => {
    outerAnimation.play(600)
    innerAnimation.play(600)
  }

  return (
    <section
      style={
        {
          '--n': ringBaseCount,
          '--outer-r': `calc(max(var(--min-r), calc((var(--n) * var(--view-w) / ${ringBaseCount > 5 ? 4 : 3}) / 6.28)) * 1.08)`,
          '--inner-r': 'calc(var(--outer-r) * 0.72)',
          width: 'calc(var(--outer-r) * 2)',
          height: 'calc(var(--outer-r) * 2)',
        } as CSSProperties & Record<'--n' | '--outer-r' | '--inner-r', string | number>
      }
      className="relative rounded-full [--min-r:176px] [--s:64px] [--view-w:100vw] md:[--min-r:344px] md:[--s:128px] md:[--view-w:64rem]"
    >
      <div ref={outerRingRef} className="absolute inset-0">
        {outerItems.map((item, i) => (
          <div
            key={`outer-${item.key}-${i.toString()}`}
            onMouseEnter={stopRotation}
            onMouseLeave={startRotation}
            className="absolute left-1/2 z-10 size-12 -translate-x-1/2 transition md:size-24"
            style={{
              rotate: `${i * (360 / outerItems.length)}deg`,
              transformOrigin: 'center var(--outer-r)',
            }}
          >
            {item.component}
          </div>
        ))}
      </div>
      <div
        style={{
          width: 'calc(var(--inner-r) * 2)',
          height: 'calc(var(--inner-r) * 2)',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div ref={innerRingRef} className="absolute inset-0">
          {innerItems.map((item, i) => (
            <div
              key={`inner-${item.key}-${i.toString()}`}
              onMouseEnter={stopRotation}
              onMouseLeave={startRotation}
              className="absolute left-1/2 z-20 size-[2.5rem] -translate-x-1/2 transition md:size-[5rem]"
              style={{
                rotate: `${i * (360 / innerItems.length)}deg`,
                transformOrigin: 'center var(--inner-r)',
              }}
            >
              {item.component}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
