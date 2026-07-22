'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useIsMounted } from '@/hooks/common'
import { cn } from '@/lib/utils/common/shadcn'
import { useStartupStore } from '@/store/use-startup-store'
import { MaxWidthWrapper } from '../../../components/shared/max-width-wrapper'
import { startupEase, startupPanelDuration } from '../start-up-motion/constant'
import { isNavGroupRoute, navigationConfig } from './constant'
import { HeaderRouteItem } from './header-route-item'
import { HeaderSubmenu } from './header-submenu'
import { useHeaderActiveRoute } from './hooks/use-header-active-route'
import { useHeaderIndicator } from './hooks/use-header-indicator'
import { useHeaderSubmenu } from './hooks/use-header-submenu'
import { useScrollVisibility } from './hooks/use-scroll-visibility'

const navigationRevealDelay = (startupPanelDuration * 1000) / 5

export default function Header() {
  const isPanelOpening = useStartupStore(s => s.isPanelOpening)
  const isAnimationComplete = useStartupStore(s => s.isAnimationComplete)
  const [isNavigationVisible, setNavigationVisible] = useState(isAnimationComplete)
  const isHeaderVisible = useScrollVisibility()
  const mounted = useIsMounted()
  const activeRoute = useHeaderActiveRoute()
  const submenu = useHeaderSubmenu()
  const indicator = useHeaderIndicator(activeRoute.activeKey)

  const shouldShowHeader = isHeaderVisible || submenu.state.isOpen
  const canInteractWithHeader = isAnimationComplete && isNavigationVisible && shouldShowHeader

  useEffect(() => {
    if (!isPanelOpening) return

    const navigationRevealTimer = window.setTimeout(() => {
      setNavigationVisible(true)
    }, navigationRevealDelay)

    return () => {
      window.clearTimeout(navigationRevealTimer)
    }
  }, [isPanelOpening])

  return (
    <motion.header
      className={cn(
        'sticky top-3 z-20 mx-auto mb-4 flex h-9 w-3/4 items-center justify-center will-change-transform md:h-12 md:w-1/2 lg:w-5/12',
        !canInteractWithHeader && 'pointer-events-none',
      )}
      initial={false}
      animate={{
        y: shouldShowHeader ? 0 : '-140%',
        opacity: shouldShowHeader ? 1 : 0,
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
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
                transition={{ duration: 0.2 }}
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
        transition={{ duration: startupPanelDuration, ease: startupEase }}
      />
      <MaxWidthWrapper
        aria-hidden={!isNavigationVisible}
        className={cn(
          'relative h-full w-full px-2.5 py-1 md:px-3 md:py-2',
          !isNavigationVisible && 'invisible',
        )}
      >
        <nav className="flex h-full items-center justify-between text-nowrap text-sm md:text-xl dark:text-neutral-400">
          {navigationConfig.map(route => (
            <HeaderRouteItem
              key={isNavGroupRoute(route) ? route.group.key : route.path}
              activeRoute={activeRoute}
              indicator={indicator}
              route={route}
              submenu={submenu}
            />
          ))}

          <motion.div
            className="absolute top-1/2 -translate-y-1/2 rounded-full bg-theme-indicator shadow-md dark:bg-white"
            animate={indicator.style}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 16,
            }}
          />

          <HeaderSubmenu activeRoute={activeRoute} submenu={submenu} />
        </nav>
      </MaxWidthWrapper>
    </motion.header>
  )
}
