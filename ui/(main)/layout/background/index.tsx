'use client'

// * thanks https://hypercolor.dev/
import type { FC } from 'react'
import { useRef } from 'react'
import { useTransitionTheme } from '@/hooks/animation/use-transition-theme'
import { useVisibilityAnimation } from '@/hooks/animation/use-visibility-animation'
import { useIsMounted } from '@/hooks/common/use-is-mounted'
import { useStartupStore } from '@/store/use-startup-store'
// * thanks https://www.mshr.app/mesh/1727202711374
import '@/lib/styles/background.css'
import { ArtPlum } from './art-plum'

const lightBackgroundKeyframes: Keyframe[] = [
  { transform: 'translate3d(-3%, 3%, 0) scale(1.03)', opacity: 0.72 },
  { transform: 'translate3d(3%, -3%, 0) scale(1.08)', opacity: 1 },
  { transform: 'translate3d(4%, 2%, 0) scale(1.05)', opacity: 0.84 },
  { transform: 'translate3d(-3%, 3%, 0) scale(1.03)', opacity: 0.72 },
]
const lightBackgroundAnimationOptions: KeyframeAnimationOptions = {
  duration: 24000,
  iterations: Infinity,
  easing: 'ease-in-out',
}

function LightBackground() {
  const isAnimationComplete = useStartupStore(s => s.isAnimationComplete)
  const motionLayerRef = useRef<HTMLDivElement>(null)
  useVisibilityAnimation({
    targetRef: motionLayerRef,
    keyframes: lightBackgroundKeyframes,
    options: lightBackgroundAnimationOptions,
    enabled: isAnimationComplete,
    willChange: 'transform',
  })

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 min-h-dvh w-screen overflow-hidden bg-light-base opacity-45">
      <div
        ref={motionLayerRef}
        className="absolute -inset-[8%] bg-light-motion [backface-visibility:hidden]"
      />
    </div>
  )
}

export const Background: FC = () => {
  const mounted = useIsMounted()
  const { resolvedTheme } = useTransitionTheme()

  if (!mounted) {
    return <div className="pointer-events-none fixed top-0 left-0 -z-20 min-h-dvh w-screen" />
  }

  if (resolvedTheme === 'light') {
    return <LightBackground />
  }

  return <ArtPlum />
}
