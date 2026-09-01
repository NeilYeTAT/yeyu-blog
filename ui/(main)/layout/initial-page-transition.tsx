'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { type ReactNode, useEffect } from 'react'
import {
  useInitialPageTransitionActions,
  useIsInitialPageReady,
} from '@/store/use-initial-page-transition-store'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import FluidOrb from '@/ui/shadcn/fluid-orb'

const minimumLoadingDuration = 800

export default function InitialPageTransition({ children }: { children: ReactNode }) {
  const translations = useTranslations()
  const isPageReady = useIsInitialPageReady()
  const { completeInitialPageTransition } = useInitialPageTransitionActions()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (isPageReady) return

    let revealTimer: number | undefined

    const revealPage = () => {
      const remainingTime = Math.max(0, minimumLoadingDuration - performance.now())

      revealTimer = window.setTimeout(() => {
        completeInitialPageTransition()
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
  }, [completeInitialPageTransition, isPageReady])

  return (
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
  )
}
