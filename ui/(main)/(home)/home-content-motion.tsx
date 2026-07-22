'use client'

import { type ReactNode, useEffect, useRef } from 'react'
import { useStartupStore } from '@/store/use-startup-store'

const enterEase = 'cubic-bezier(0.16, 1, 0.3, 1)'
const enterDelay = 0
const enterStagger = 300

export function HomeMotionMain({ children }: { children: ReactNode }) {
  const isAnimationComplete = useStartupStore(s => s.isAnimationComplete)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const main = mainRef.current
    if (!isAnimationComplete || main === null) return

    const items = Array.from(main.querySelectorAll<HTMLElement>('[data-home-enter]'))
    main.style.opacity = '1'

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(item => {
        item.style.opacity = '1'
        item.style.transform = 'translateY(0)'
      })
      return
    }

    const animations = items.map((item, index) => {
      const offset = item.dataset.homeEnter === 'avatar' ? '-50px' : '50px'
      const shouldTranslate = item.dataset.homeEnter !== 'fade'
      const animation = item.animate(
        [
          {
            opacity: 0,
            transform: shouldTranslate ? `translateY(${offset})` : 'translateY(0)',
          },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        {
          duration: shouldTranslate ? 700 : 800,
          delay: enterDelay + index * enterStagger,
          easing: enterEase,
          fill: 'both',
        },
      )

      animation.onfinish = () => {
        item.style.opacity = '1'
        item.style.transform = 'translateY(0)'
        animation.cancel()
      }

      return animation
    })

    return () => {
      animations.forEach(animation => animation.cancel())
    }
  }, [isAnimationComplete])

  return (
    <main
      ref={mainRef}
      className="flex w-full flex-col items-center justify-center gap-4 pt-16 pb-4"
      style={{ opacity: 0 }}
    >
      {children}
    </main>
  )
}

export function HomeAvatarMotion({ children }: { children: ReactNode }) {
  return (
    <div
      data-home-enter="avatar"
      className="flex w-full justify-center"
      style={{ opacity: 0, transform: 'translateY(-50px)' }}
    >
      {children}
    </div>
  )
}

export function HomeBioMotion({ children }: { children: ReactNode }) {
  return (
    <div
      data-home-enter="bio"
      className="flex w-full justify-center"
      style={{ opacity: 0, transform: 'translateY(50px)' }}
    >
      {children}
    </div>
  )
}

export function HomeFadeMotion({ children }: { children: ReactNode }) {
  return (
    <div data-home-enter="fade" className="flex w-full justify-center" style={{ opacity: 0 }}>
      {children}
    </div>
  )
}
