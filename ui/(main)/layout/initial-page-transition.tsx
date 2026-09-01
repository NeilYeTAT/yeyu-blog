'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { type ReactNode, useEffect, useState } from 'react'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import FluidOrb from '@/ui/shadcn/fluid-orb'
import { InitialPageTransitionProvider } from './initial-page-transition-context'

const minimumLoadingDuration = 800

export default function InitialPageTransition({ children }: { children: ReactNode }) {
  const translations = useTranslations()
  const [isPageReady, setIsPageReady] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    let revealTimer: number | undefined

    const revealPage = () => {
      const remainingTime = Math.max(0, minimumLoadingDuration - performance.now())

      revealTimer = window.setTimeout(() => {
        setIsPageReady(true)
      }, remainingTime)
    }

    if (document.readyState === 'complete') {
      revealPage()
    } else {
      window.addEventListener('load', revealPage, { once: true })
    }

    return () => {
      window.removeEventListener('load', revealPage)
      if (revealTimer !== undefined) window.clearTimeout(revealTimer)
    }
  }, [])

  return (
    <InitialPageTransitionProvider isPageRevealing={isPageReady}>
      <div className={isPageReady ? undefined : 'h-dvh overflow-hidden'}>
        <div aria-hidden={!isPageReady} inert={!isPageReady}>
          {children}
        </div>

        <AnimatePresence initial={false}>
          {!isPageReady && (
            <motion.div
              key="initial-page-loading"
              role="status"
              aria-label={translations.common.pageLoading}
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.36,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="fixed inset-0 z-[1000] flex items-center justify-center bg-theme-background"
            >
              <FluidOrb
                size={168}
                color="var(--theme-accent)"
                maxDpr={1.5}
                frameRate={30}
                aria-hidden
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </InitialPageTransitionProvider>
  )
}
