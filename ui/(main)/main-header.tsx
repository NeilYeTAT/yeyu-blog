'use client'

import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useIndicatorPosition } from '@/lib/hooks/animation'
import { getActiveMainPath } from '@/lib/url'
import { cn } from '@/lib/utils/common/shadcn'
import { MaxWidthWrapper } from '../components/shared/max-width-wrapper'

export type NavRoute = {
  path: string
  pathName: string
  disabled?: boolean
}

export type NavGroup = {
  key: string
  mainPath?: string
  disabled?: boolean
  items: [NavRoute, ...NavRoute[]]
}

export type RouteItem = (NavRoute & { group?: never }) | { group: NavGroup }

const RouteList: RouteItem[] = [
  {
    path: '/',
    pathName: '首页',
  },
  {
    group: {
      key: 'hand note',
      mainPath: '/blog',
      items: [
        {
          path: '/note',
          pathName: '笔记',
        },
        {
          path: '/blog',
          pathName: '日志',
        },
      ],
    },
  },
  {
    group: {
      key: 'refer',
      mainPath: '/refer',
      disabled: true,
      items: [
        {
          path: '/refer',
          pathName: '参考',
        },
        {
          path: '/tool',
          pathName: '工具',
        },
      ],
    },
  },
  {
    path: '/about',
    pathName: '关于',
  },
  // TODO: login
  {
    path: '/more',
    pathName: '更多',
    disabled: true,
  },
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction === 0 ? 0 : direction > 0 ? 20 : -20,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction === 0 ? 0 : direction < 0 ? 20 : -20,
    opacity: 0,
  }),
}

export default function MainHeader() {
  const pathname = usePathname()
  const activeUrl = getActiveMainPath(pathname)
  const refs = useRef(new Map<string, HTMLElement>())
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const [direction, setDirection] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [groupLastActivePaths, setGroupLastActivePaths] = useState<Record<string, string>>({})
  const [prevActiveUrl, setPrevActiveUrl] = useState(activeUrl)

  if (activeUrl !== prevActiveUrl) {
    setPrevActiveUrl(activeUrl)

    const activeRoute = RouteList.find(
      route =>
        'group' in route &&
        route.group != null &&
        route.group.items.some(item => item.path === activeUrl),
    )

    if (activeRoute != null && 'group' in activeRoute && activeRoute.group != null) {
      setGroupLastActivePaths(prev => ({
        ...prev,
        [activeRoute.group!.key]: activeUrl,
      }))
    }
  }

  const activeKey = useMemo(() => {
    const activeRoute = RouteList.find(route => {
      if ('group' in route && route.group != null) {
        return route.group.items.some(item => item.path === activeUrl)
      }
      return route.path === activeUrl
    })
    if (activeRoute != null && 'group' in activeRoute && activeRoute.group != null) {
      return activeRoute.group.key
    }
    return activeRoute?.path ?? activeUrl
  }, [activeUrl])

  const isSubmenuOpen = useMemo(() => {
    return RouteList.some(
      route => 'group' in route && route.group != null && route.group.key === hoveredPath,
    )
  }, [hoveredPath])

  const indicatorStyle = useIndicatorPosition(activeKey, refs)

  const handleLinkClick = (e: React.MouseEvent, disabled?: boolean) => {
    if (disabled === true) {
      e.preventDefault()
      toast('Coming soon...', {
        position: 'top-left',
      })
    }
  }

  const handleMouseEnter = (path: string) => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    const newIndex = RouteList.findIndex(r => 'group' in r && r.group?.key === path)
    const oldIndex = RouteList.findIndex(r => 'group' in r && r.group?.key === hoveredPath)

    if (newIndex !== -1 && oldIndex !== -1 && newIndex !== oldIndex) {
      setDirection(newIndex > oldIndex ? 1 : -1)
    }

    setHoveredPath(path)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredPath(null)
      setDirection(0)
    }, 150)
  }

  const activeGroupRoute = useMemo(() => {
    return RouteList.find(
      route => 'group' in route && route.group != null && route.group.key === hoveredPath,
    ) as (RouteItem & { group: NavGroup }) | undefined
  }, [hoveredPath])

  return (
    <header className="sticky top-3 z-20 mx-auto mb-4 flex h-9 w-3/4 items-center justify-center md:h-12 md:w-1/2 lg:w-5/12">
      <AnimatePresence>
        {isSubmenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 -z-10 bg-black/5 backdrop-blur-xs dark:bg-black/20"
          />
        )}
      </AnimatePresence>
      <MaxWidthWrapper
        className={cn(
          // TODO: config other colors
          'bg-clear-sky-background/80 h-full rounded-full backdrop-blur-sm dark:bg-black/70',
          'px-2.5 py-1 md:px-3 md:py-2',
          'border border-[#00000011] dark:border-white/10',
          'shadow-[0px_4px_10px_0px_#0000001A]',
          'w-full',
        )}
      >
        <nav className="flex h-full items-center justify-between text-sm text-nowrap md:text-xl dark:text-neutral-400">
          {RouteList.map(route => {
            if ('group' in route && route.group != null) {
              const isGroupActive = route.group.key === activeKey
              const isGroupHovered = hoveredPath === route.group.key

              const lastActivePath = groupLastActivePaths[route.group.key]
              const mainPath = route.group.mainPath ?? route.group.items[0].path

              const effectivePath =
                route.group.items.find(item => item.path === activeUrl)?.path ??
                (lastActivePath != null && route.group.items.some(i => i.path === lastActivePath)
                  ? lastActivePath
                  : null) ??
                mainPath

              const currentItem =
                route.group.items.find(item => item.path === effectivePath) ?? route.group.items[0]
              const currentPathName = currentItem.pathName

              return (
                <div
                  key={route.group.key}
                  ref={el => {
                    if (el != null) refs.current.set(route.group.key, el)
                  }}
                  className="z-10"
                  onMouseEnter={() => handleMouseEnter(route.group.key)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={effectivePath}
                    onClick={e => handleLinkClick(e, route.group.disabled)}
                    className={cn(
                      'block cursor-pointer transition-colors',
                      isGroupActive
                        ? 'text-clear-sky-active-text font-bold dark:text-black'
                        : 'dark:hover:text-neutral-200',
                    )}
                  >
                    <div className="relative px-2 md:px-4">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.h2
                          key={currentPathName}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}
                        >
                          {currentPathName}
                        </motion.h2>
                      </AnimatePresence>
                      <HoverBackground isVisible={!isGroupActive && isGroupHovered} />
                    </div>
                  </Link>
                </div>
              )
            }

            const path = route.path
            const pathName = route.pathName

            return (
              <Link
                key={path}
                href={path}
                ref={el => {
                  if (el != null) refs.current.set(path, el)
                }}
                onClick={e => handleLinkClick(e, route.disabled)}
                className={cn(
                  'relative z-10 px-2 transition-colors md:px-4',
                  path === activeKey
                    ? 'text-clear-sky-active-text font-bold dark:text-black'
                    : 'dark:hover:text-neutral-200',
                )}
                onMouseEnter={() => handleMouseEnter(path)}
                onMouseLeave={handleMouseLeave}
              >
                <h2>{pathName}</h2>
                <HoverBackground isVisible={hoveredPath !== activeKey && hoveredPath === path} />
              </Link>
            )
          })}

          <motion.div
            className="bg-clear-sky-indicator absolute top-1/2 -translate-y-1/2 rounded-full shadow-md dark:bg-white"
            animate={indicatorStyle}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 16,
            }}
          />

          {/* Submenu */}
          <AnimatePresence>
            {isSubmenuOpen && activeGroupRoute != null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'absolute top-[116%] left-0 w-full overflow-hidden rounded-3xl py-1 backdrop-blur-sm md:py-2',
                  'bg-clear-sky-background/80 dark:bg-black/70',
                  'border border-[#00000011] dark:border-white/10',
                  'shadow-[0px_4px_10px_0px_#0000001A]',
                )}
                onMouseEnter={() => {
                  if (timeoutRef.current != null) {
                    clearTimeout(timeoutRef.current)
                    timeoutRef.current = null
                  }
                }}
                onMouseLeave={handleMouseLeave}
              >
                <AnimatePresence mode="popLayout" custom={direction}>
                  <motion.div
                    key={activeGroupRoute.group.key}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="flex justify-around px-8 md:px-12"
                  >
                    {activeGroupRoute.group.items.map(item => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={e =>
                          handleLinkClick(
                            e,
                            (activeGroupRoute.group.disabled ?? false) || (item.disabled ?? false),
                          )
                        }
                        className={cn(
                          'rounded-lg px-4 py-2 transition-colors',
                          'hover:underline',
                          item.path === activeUrl
                            ? 'text-clear-sky-active-text font-bold'
                            : 'text-neutral-600 dark:text-neutral-400',
                        )}
                      >
                        {item.pathName}
                      </Link>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </MaxWidthWrapper>
    </header>
  )
}

function HoverBackground({ isVisible }: { isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          layoutId="hoverBackground"
          className="absolute -inset-x-1 -inset-y-0.5 -z-10 rounded-full bg-white/60 shadow-sm dark:bg-neutral-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        />
      )}
    </AnimatePresence>
  )
}
