'use client'

import { motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'
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

  return (
    <motion.header
      className={cn(
        'sticky top-5 z-20 mx-auto mt-5 mb-4 h-10 w-[calc(100%-2rem)] max-w-[550px] overflow-hidden rounded-full bg-black text-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] sm:h-12',
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
          className="flex h-full items-center pl-4 font-medium font-serif text-xl leading-none sm:pl-5 [&>span]:translate-y-px"
          aria-label="返回首页"
        >
          Yuuri &amp;
        </WaveLink>

        <nav aria-label="主导航" className="grid h-full grid-cols-4 items-center">
          {navigationConfig.map(route => {
            const isActive = route.type !== 'button' && route.pattern.test(pathname)

            return (
              <NavItem
                key={route.path}
                item={route}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex h-full items-center justify-center font-serif text-xs leading-none transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[-4px] sm:text-lg',
                  waveLinkTriggerClassName,
                  isActive ? 'font-bold text-white' : 'font-normal text-white/90 hover:text-white',
                )}
              >
                <span
                  className={cn(
                    waveLinkUnderlineClassName,
                    isActive && 'after:[clip-path:inset(0)]',
                  )}
                >
                  {route.pathName}
                </span>
              </NavItem>
            )
          })}
        </nav>
      </div>
    </motion.header>
  )
}
