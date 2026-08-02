import type { useHeaderActiveRoute } from './hooks/use-header-active-route'
import type { useHeaderSubmenu } from './hooks/use-header-submenu'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils/common/shadcn'
import { activeTextShadowClass, inactiveTextShadowClass, slideVariants } from './constant'
import { NavItem } from './nav-item'

export function HeaderSubmenu({
  activeRoute,
  submenu,
}: {
  activeRoute: ReturnType<typeof useHeaderActiveRoute>
  submenu: ReturnType<typeof useHeaderSubmenu>
}) {
  const { activeGroupRoute, direction } = submenu.state
  const shouldReduceMotion = useReducedMotion()
  const motionDirection = shouldReduceMotion ? 0 : direction

  return (
    <AnimatePresence>
      {activeGroupRoute != null && (
        <motion.div
          initial={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 8,
            scale: shouldReduceMotion ? 1 : 0.98,
          }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 8,
            scale: shouldReduceMotion ? 1 : 0.98,
          }}
          transition={
            shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
          }
          className={cn(
            'absolute top-[116%] left-0 w-full origin-top overflow-hidden rounded-3xl py-1 backdrop-blur-sm md:py-2',
            'bg-theme-background/80 dark:bg-black/70',
            'border border-[#00000011] dark:border-white/10',
            'shadow-[0px_4px_10px_0px_#00000010]',
          )}
        >
          <AnimatePresence mode="popLayout" custom={motionDirection}>
            <motion.div
              key={activeGroupRoute.group.key}
              custom={motionDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: shouldReduceMotion ? 0 : 0.16,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex justify-around px-8 md:px-12"
            >
              {activeGroupRoute.group.items.map(item => (
                <NavItem
                  key={item.path}
                  item={{
                    ...item,
                    disabled: activeGroupRoute.group.disabled === true || item.disabled === true,
                  }}
                  className={cn(
                    'rounded-lg px-4 py-2 transition-[color,text-shadow] duration-200 ease-out',
                    'hover:underline',
                    item.path === activeRoute.effectiveActiveUrl
                      ? cn('text-primary', activeTextShadowClass)
                      : cn('text-neutral-600 dark:text-neutral-400', inactiveTextShadowClass),
                  )}
                >
                  {item.pathName}
                </NavItem>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
