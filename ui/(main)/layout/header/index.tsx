'use client'

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { createPortal } from 'react-dom'
import { useIsMounted } from '@/hooks/common/use-is-mounted'
import { cn } from '@/lib/utils/common/shadcn'
import { useStartupStore } from '@/store/use-startup-store'
import { MaxWidthWrapper } from '../../../components/shared/max-width-wrapper'
import { startupEase, startupPanelDuration } from '../start-up-motion/constant'
import { isNavGroupRoute, navigationConfig } from './constant'
import { HeaderRouteItem } from './header-route-item'
import { HeaderSubmenu } from './header-submenu'
import { useHeaderActiveRoute } from './hooks/use-header-active-route'
import { useHeaderSubmenu } from './hooks/use-header-submenu'
import { useScrollVisibility } from './hooks/use-scroll-visibility'

const navigationRevealDelay = startupPanelDuration / 5

export default function Header() {
  const isPanelOpening = useStartupStore(s => s.isPanelOpening)
  const isAnimationComplete = useStartupStore(s => s.isAnimationComplete)
  const isHeaderVisible = useScrollVisibility()
  const shouldReduceMotion = useReducedMotion()
  const mounted = useIsMounted()
  const activeRoute = useHeaderActiveRoute()
  const submenu = useHeaderSubmenu()

  const shouldShowHeader = isHeaderVisible || submenu.state.isOpen
  const canInteractWithHeader = isAnimationComplete && shouldShowHeader

  return (
    <motion.header
      className={cn(
        'sticky top-3 z-20 mx-auto mb-4 flex h-9 w-3/4 items-center justify-center will-change-transform md:h-12 md:w-1/2 lg:w-5/12',
        !canInteractWithHeader && 'pointer-events-none',
      )}
      initial={false}
      animate={{
        y: shouldShowHeader || shouldReduceMotion ? 0 : '-140%',
        opacity: shouldShowHeader ? 1 : 0,
      }}
      transition={
        shouldReduceMotion
          ? { duration: 0.12 }
          : shouldShowHeader
            ? { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
            : { duration: 0.18, ease: [0.4, 0, 1, 1] }
      }
    >
      {mounted &&
        createPortal(
          <AnimatePresence>
            {submenu.state.isOpen && (
              <motion.button
                type="button"
                aria-label="关闭导航菜单"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.14 }}
                className="fixed inset-0 z-10 cursor-default appearance-none border-0 bg-black/5 p-0 backdrop-blur-xs dark:bg-black/20"
                onClick={submenu.close}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 h-full -translate-x-1/2 rounded-full border border-[#00000011] bg-theme-background/80 shadow-[0px_4px_10px_0px_#0000001A] backdrop-blur-sm will-change-[width] dark:border-white/10 dark:bg-black/70"
        initial={false}
        animate={{ width: isPanelOpening ? '100%' : '4rem' }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: startupPanelDuration, ease: startupEase }
        }
      />
      <MaxWidthWrapper
        aria-hidden={!canInteractWithHeader}
        inert={!canInteractWithHeader}
        className="relative h-full w-full px-2.5 py-1 md:px-3 md:py-2"
      >
        <motion.nav
          className="flex h-full items-center justify-between text-nowrap text-sm md:text-xl dark:text-neutral-400"
          initial={false}
          animate={{
            opacity: isPanelOpening ? 1 : 0,
            y: isPanelOpening || shouldReduceMotion ? 0 : 4,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: 0.22,
                  delay: isPanelOpening ? navigationRevealDelay : 0,
                  ease: [0.22, 1, 0.36, 1],
                }
          }
        >
          <LayoutGroup id="header-navigation">
            {navigationConfig.map(route => (
              <HeaderRouteItem
                key={isNavGroupRoute(route) ? route.group.key : route.path}
                activeRoute={activeRoute}
                route={route}
                submenu={submenu}
              />
            ))}

            <HeaderSubmenu activeRoute={activeRoute} submenu={submenu} />
          </LayoutGroup>
        </motion.nav>
      </MaxWidthWrapper>
    </motion.header>
  )
}
