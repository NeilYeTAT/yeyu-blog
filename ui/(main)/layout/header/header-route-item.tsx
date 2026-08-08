import type { useHeaderActiveRoute } from './hooks/use-header-active-route'
import type { useHeaderSubmenu } from './hooks/use-header-submenu'
import type { RouteItem } from './types'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils/common/shadcn'
import {
  waveLinkTriggerClassName,
  waveLinkUnderlineClassName,
} from '@/ui/components/shared/wave-link'
import { activeTextShadowClass, inactiveTextShadowClass, isNavGroupRoute } from './constant'
import { NavItem } from './nav-item'

export function HeaderRouteItem({
  activeRoute,
  route,
  submenu,
}: {
  activeRoute: ReturnType<typeof useHeaderActiveRoute>
  route: RouteItem
  submenu: ReturnType<typeof useHeaderSubmenu>
}) {
  const shouldReduceMotion = useReducedMotion()

  if (isNavGroupRoute(route)) {
    const { group } = route
    const currentItem = activeRoute.getGroupCurrentItem(group)
    const isGroupActive = group.key === activeRoute.activeKey

    return (
      <div className="z-10" {...submenu.getGroupTriggerProps(group.key)}>
        <NavItem
          item={currentItem}
          className={cn(
            'relative z-10 block cursor-pointer transition-[color,text-shadow] duration-200 ease-out',
            waveLinkTriggerClassName,
            isGroupActive
              ? cn('text-theme-accent-foreground dark:text-black', activeTextShadowClass)
              : inactiveTextShadowClass,
          )}
        >
          <div className="relative px-2 md:px-4">
            {isGroupActive && (
              <motion.span
                layoutId="header-active-indicator"
                aria-hidden="true"
                className="absolute -inset-x-1 -inset-y-0.5 -z-10 rounded-full bg-theme-accent shadow-md dark:bg-white"
                initial={false}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 220, damping: 20, mass: 0.9 }
                }
              />
            )}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.h2
                key={currentItem.pathName}
                className={waveLinkUnderlineClassName}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.14, ease: 'easeOut' }}
              >
                {currentItem.pathName}
              </motion.h2>
            </AnimatePresence>
          </div>
        </NavItem>
      </div>
    )
  }

  return (
    <NavItem
      item={route}
      className={cn(
        'relative z-10 block transition-[color,text-shadow] duration-200 ease-out',
        waveLinkTriggerClassName,
        route.path === activeRoute.activeKey
          ? cn('text-theme-accent-foreground dark:text-black', activeTextShadowClass)
          : inactiveTextShadowClass,
      )}
      {...submenu.getRouteItemProps(route.path)}
    >
      <div className="relative px-2 md:px-4">
        {route.path === activeRoute.activeKey && (
          <motion.span
            layoutId="header-active-indicator"
            aria-hidden="true"
            className="absolute -inset-x-1 -inset-y-0.5 -z-10 rounded-full bg-theme-accent shadow-md dark:bg-white"
            initial={false}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 220, damping: 20, mass: 0.9 }
            }
          />
        )}
        <h2 className={waveLinkUnderlineClassName}>{route.pathName}</h2>
      </div>
    </NavItem>
  )
}
