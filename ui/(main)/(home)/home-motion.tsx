'use client'

import type { Variants } from 'motion/react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect } from 'react'
import { useHasCompletedHomeLoading, useHomeLoadingActions } from '@/store/use-home-loading-store'
import { useLanguage, useTranslations } from '@/ui/components/provider/main/language-provider'
import FluidOrb from '@/ui/shadcn/fluid-orb'

const minimumLoadingDuration = 800

const homeVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.04,
      staggerChildren: 0.12,
    },
  },
}

const textVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: [0.16, 1, 0.3, 1] },
  },
}

const avatarVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.9, rotate: -3 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.82, ease: [0.16, 1, 0.3, 1] },
  },
}

export function HomeMotion({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion()
  const { isLanguageChanging } = useLanguage()
  const translations = useTranslations()
  const hasCompletedHomeLoading = useHasCompletedHomeLoading()
  const { completeHomeLoading } = useHomeLoadingActions()
  const isLoading = !hasCompletedHomeLoading && !shouldReduceMotion && !isLanguageChanging

  useEffect(() => {
    if (hasCompletedHomeLoading) return

    if (shouldReduceMotion || isLanguageChanging) {
      completeHomeLoading()
      return
    }

    let revealTimer: number | undefined
    const revealPage = () => {
      const remainingTime = Math.max(0, minimumLoadingDuration - performance.now())

      revealTimer = window.setTimeout(() => {
        completeHomeLoading()
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
  }, [completeHomeLoading, hasCompletedHomeLoading, isLanguageChanging, shouldReduceMotion])

  return (
    <>
      <motion.div
        aria-hidden={isLoading}
        className="contents"
        initial={shouldReduceMotion || isLanguageChanging ? false : 'hidden'}
        animate={isLoading ? 'hidden' : 'visible'}
        inert={isLoading}
        variants={homeVariants}
      >
        {children}
      </motion.div>

      <AnimatePresence initial={false}>
        {isLoading ? (
          <motion.div
            key="home-loading"
            role="status"
            aria-label={translations.common.pageLoading}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-theme-background"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.36, ease: [0.4, 0, 0.2, 1] }}
          >
            <FluidOrb
              aria-hidden
              color="var(--theme-accent)"
              frameRate={30}
              maxDpr={1.5}
              size={168}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export function HomeTextMotion({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const { language } = useLanguage()
  const shouldReduceMotion = useReducedMotion()
  const languageOffset = language === 'en' ? '100%' : '-100%'

  return (
    <motion.div className={className} variants={textVariants}>
      <div className="grid overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={language}
            className="col-start-1 row-start-1 min-w-0"
            initial={shouldReduceMotion ? false : { opacity: 0, y: languageOffset }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: languageOffset }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function HomeAvatarMotion({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.figure className={className} variants={avatarVariants}>
      {children}
    </motion.figure>
  )
}
