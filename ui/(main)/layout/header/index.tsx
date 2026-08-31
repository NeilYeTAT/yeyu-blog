'use client'

import { Languages } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import {
  WaveLink,
  waveLinkTriggerClassName,
  waveLinkUnderlineClassName,
} from '@/ui/components/shared/wave-link'
import { navigationConfig } from './constant'
import { useScrollVisibility } from './hooks/use-scroll-visibility'
import { NavItem } from './nav-item'

export default function Header() {
  const pathname = usePathname()
  const isHeaderVisible = useScrollVisibility()
  const shouldReduceMotion = useReducedMotion()
  const [language, setLanguage] = useState<'zh' | 'en'>('zh')

  return (
    <motion.header
      className={cn(
        'sticky top-5 z-20 mx-auto mt-5 mb-4 h-10 w-[calc(100%-2rem)] max-w-[550px] overflow-hidden rounded-full bg-black font-header text-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] sm:h-12',
        !isHeaderVisible && 'pointer-events-none',
      )}
      initial={false}
      animate={{
        y: isHeaderVisible || shouldReduceMotion ? 0 : '-140%',
        opacity: isHeaderVisible ? 1 : 0,
      }}
      transition={
        shouldReduceMotion
          ? { duration: 0.12 }
          : isHeaderVisible
            ? { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
            : { duration: 0.18, ease: [0.4, 0, 1, 1] }
      }
    >
      <div className="grid h-full grid-cols-[5rem_1fr] items-center sm:grid-cols-[7rem_1fr]">
        <WaveLink
          href="/"
          withWaveUnderline={false}
          className="flex h-full items-center pl-4 font-header-brand text-xl leading-none sm:pl-5"
          aria-label="返回首页"
        >
          <span className="translate-y-px">Yuuri &amp;</span>
        </WaveLink>

        <nav aria-label="主导航" className="grid h-full grid-cols-4 items-center">
          {navigationConfig.map(route => {
            const isActive = route.type !== 'button' && route.pattern.test(pathname)
            const isLanguageRoute = route.path === '/language'

            return (
              <NavItem
                key={route.path}
                item={route}
                aria-current={isActive ? 'page' : undefined}
                aria-label={
                  isLanguageRoute ? (language === 'zh' ? '切换到英文' : '切换到中文') : undefined
                }
                onButtonClick={
                  isLanguageRoute
                    ? () => {
                        setLanguage(currentLanguage => (currentLanguage === 'zh' ? 'en' : 'zh'))
                      }
                    : undefined
                }
                className={cn(
                  'flex h-full items-center justify-center text-xs leading-none transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[-4px] sm:text-lg',
                  waveLinkTriggerClassName,
                  route.type === 'button' && 'cursor-pointer',
                  isActive ? 'font-bold text-white' : 'font-normal text-white/90 hover:text-white',
                )}
              >
                <span
                  className={cn(
                    waveLinkUnderlineClassName,
                    'after:-bottom-1 after:bg-[color-mix(in_srgb,var(--theme-accent)_50%,white)]',
                    isLanguageRoute && 'inline-flex items-center gap-1',
                    isActive && 'after:[clip-path:inset(0)]',
                  )}
                >
                  {isLanguageRoute && (
                    <Languages aria-hidden="true" className="size-3.5 shrink-0 sm:size-4" />
                  )}
                  {isLanguageRoute ? (
                    <span className="inline-block w-5 text-center">
                      {language === 'zh' ? 'EN' : 'ZH'}
                    </span>
                  ) : (
                    route.pathName
                  )}
                </span>
              </NavItem>
            )
          })}
        </nav>
      </div>
    </motion.header>
  )
}
