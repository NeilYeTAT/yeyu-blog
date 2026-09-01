'use client'

import { Languages } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/common/shadcn'
import { useLanguage, useTranslations } from '@/ui/components/provider/main/language-provider'
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
  const { language, toggleLanguage } = useLanguage()
  const translations = useTranslations()
  const languageOffset = language === 'en' ? '100%' : '-100%'
  const languagePathPrefix = `/${language}`
  const currentPathname =
    pathname === languagePathPrefix ? '/' : pathname.slice(languagePathPrefix.length)

  return (
    <motion.header
      className={cn(
        'sticky top-5 z-20 mx-auto mt-5 mb-4 h-10 w-[calc(100%-2rem)] max-w-[550px] overflow-hidden rounded-full bg-black font-header text-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] transition-[background-color,box-shadow] duration-300 sm:h-12 dark:bg-zinc-950/76 dark:shadow-[0_10px_28px_rgba(0,0,0,0.28)] dark:ring-1 dark:ring-white/10 dark:backdrop-blur-xl',
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
          href={languagePathPrefix}
          withWaveUnderline={false}
          className="flex h-full items-center pl-4 font-header-brand text-xl leading-none sm:pl-5"
          aria-label={translations.header.homeLabel}
        >
          <span className="translate-y-px">Yuuri &amp;</span>
        </WaveLink>

        <nav
          aria-label={translations.header.navigationLabel}
          className="grid h-full grid-cols-4 items-center"
        >
          {navigationConfig.map(route => {
            const isActive = route.type !== 'button' && route.pattern.test(currentPathname)
            const isLanguageRoute = route.path === '/language'

            return (
              <NavItem
                key={route.path}
                item={route}
                aria-current={isActive ? 'page' : undefined}
                aria-label={
                  isLanguageRoute
                    ? translations.header.switchLanguageLabel
                    : translations.header.routes[route.pathName]
                }
                onButtonClick={isLanguageRoute ? toggleLanguage : undefined}
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
                    'inline-flex items-center',
                    isLanguageRoute && 'gap-1',
                    isActive && 'after:[clip-path:inset(0)]',
                  )}
                >
                  {isLanguageRoute && (
                    <Languages aria-hidden="true" className="size-3.5 shrink-0 sm:size-4" />
                  )}
                  <span
                    className={cn(
                      'grid h-[1.25em] overflow-hidden whitespace-nowrap leading-[1.25]',
                      isLanguageRoute && 'w-5 text-center',
                    )}
                  >
                    <AnimatePresence initial={false}>
                      <motion.span
                        key={language}
                        aria-hidden="true"
                        className="col-start-1 row-start-1 flex items-center justify-center"
                        initial={shouldReduceMotion ? false : { opacity: 0, y: languageOffset }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: languageOffset }}
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
                        }
                      >
                        {translations.header.routes[route.pathName]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>
              </NavItem>
            )
          })}
        </nav>
      </div>
    </motion.header>
  )
}
