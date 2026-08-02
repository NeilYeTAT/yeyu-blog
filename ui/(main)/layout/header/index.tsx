'use client'

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { createPortal } from 'react-dom'
import { useIsHydrated } from '@/hooks/common/use-is-mounted'
import { cn } from '@/lib/utils/common/shadcn'
import { MaxWidthWrapper } from '../../../components/shared/max-width-wrapper'
import { isNavGroupRoute, navigationConfig } from './constant'
import { HeaderRouteItem } from './header-route-item'
import { HeaderSubmenu } from './header-submenu'
import { useHeaderActiveRoute } from './hooks/use-header-active-route'
import { useHeaderSubmenu } from './hooks/use-header-submenu'
import { useScrollVisibility } from './hooks/use-scroll-visibility'

const headerEase: [number, number, number, number] = [0.76, 0, 0.24, 1]
const headerExpandDuration = 0.48
const navigationRevealDelay = headerExpandDuration / 5

const HeaderBackdropPortal = ({
  isOpen,
  onClose,
  shouldReduceMotion,
}: {
  isOpen: boolean
  onClose: () => void
  shouldReduceMotion: boolean | null
}) => {
  const mounted = useIsHydrated()

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.button
          type="button"
          aria-label="关闭导航菜单"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.14 }}
          className="fixed inset-0 z-10 cursor-default appearance-none border-0 bg-black/5 p-0 backdrop-blur-xs dark:bg-black/20"
          onClick={onClose}
        />
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default function Header() {
  const isHeaderReady = useIsHydrated()
  const isHeaderVisible = useScrollVisibility()
  const shouldReduceMotion = useReducedMotion()
  const activeRoute = useHeaderActiveRoute()
  const submenu = useHeaderSubmenu()

  const shouldShowHeader = isHeaderVisible || submenu.state.isOpen
  const canInteractWithHeader = shouldShowHeader

  return (
    <motion.header
      className={cn(
        'sticky top-3 z-20 mx-auto mb-4 flex h-9 w-3/4 items-center justify-center md:h-12 md:w-1/2 lg:w-5/12',
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
      <HeaderBackdropPortal
        isOpen={submenu.state.isOpen}
        onClose={submenu.close}
        shouldReduceMotion={shouldReduceMotion}
      />
      <motion.div
        aria-hidden="true"
        layout="size"
        className={cn(
          'pointer-events-none absolute inset-y-0 right-0 left-0 mx-auto h-full rounded-full border border-[#00000011] bg-theme-background/80 shadow-[0px_4px_10px_0px_#0000001A] backdrop-blur-sm dark:border-white/10 dark:bg-black/70',
          isHeaderReady ? 'w-full' : 'w-16',
        )}
        initial={false}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: headerExpandDuration, ease: headerEase }
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
            opacity: isHeaderReady ? 1 : 0,
            y: isHeaderReady || shouldReduceMotion ? 0 : 4,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: 0.22,
                  delay: isHeaderReady ? navigationRevealDelay : 0,
                  ease: [0.22, 1, 0.36, 1],
                }
          }
          {...submenu.hoverAreaProps}
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
