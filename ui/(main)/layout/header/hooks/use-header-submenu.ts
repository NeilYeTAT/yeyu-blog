import type { MouseEvent, PointerEvent } from 'react'
import { usePathname } from 'next/navigation'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { navGroupIndexMap, navGroupRouteMap } from '../constant'

const closeDelay = 150

const getNavGroupIndex = (path: string | null) => {
  if (path == null) return -1

  return navGroupIndexMap.get(path) ?? -1
}

export const useHeaderSubmenu = () => {
  const pathname = usePathname()
  const routePathnameRef = useRef(pathname)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchTargetPathRef = useRef<string | null>(null)
  const touchStartedOpenPathRef = useRef<string | null>(null)
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const [direction, setDirection] = useState(0)

  const activeGroupRoute = hoveredPath == null ? undefined : navGroupRouteMap.get(hoveredPath)

  const clearCloseTimer = () => {
    if (timeoutRef.current == null) return

    clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }

  const showNavPath = (path: string) => {
    clearCloseTimer()

    const newIndex = getNavGroupIndex(path)
    const oldIndex = getNavGroupIndex(hoveredPath)

    if (newIndex !== -1 && oldIndex !== -1 && newIndex !== oldIndex) {
      setDirection(newIndex > oldIndex ? 1 : -1)
    } else if (newIndex === -1 || oldIndex === -1) {
      setDirection(0)
    }

    setHoveredPath(path)
  }

  const close = () => {
    clearCloseTimer()
    touchTargetPathRef.current = null
    touchStartedOpenPathRef.current = null
    setHoveredPath(null)
    setDirection(0)
  }
  const closeEvent = useEffectEvent(close)
  const clearCloseTimerEvent = useEffectEvent(clearCloseTimer)

  useEffect(() => {
    if (routePathnameRef.current === pathname) return

    routePathnameRef.current = pathname
    closeEvent()
  }, [pathname])

  useEffect(() => {
    return () => {
      clearCloseTimerEvent()
    }
  }, [])

  const handlePointerEnter = (event: PointerEvent<HTMLElement>, path: string) => {
    if (event.pointerType !== 'mouse') return

    showNavPath(path)
  }

  const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return

    clearCloseTimer()
    timeoutRef.current = setTimeout(() => {
      close()
    }, closeDelay)
  }

  const handleGroupPointerDown = (event: PointerEvent<HTMLElement>, path: string) => {
    if (event.pointerType === 'mouse') {
      touchTargetPathRef.current = null
      touchStartedOpenPathRef.current = null
      return
    }

    touchTargetPathRef.current = path
    touchStartedOpenPathRef.current = hoveredPath === path ? path : null
  }

  const handleGroupClickCapture = (event: MouseEvent<HTMLElement>, path: string) => {
    if (touchTargetPathRef.current !== path) return

    event.preventDefault()
    event.stopPropagation()

    if (touchStartedOpenPathRef.current === path) {
      close()
    } else {
      showNavPath(path)
    }

    touchTargetPathRef.current = null
    touchStartedOpenPathRef.current = null
  }

  const state = {
    activeGroupRoute,
    direction,
    hoveredPath,
    isOpen: activeGroupRoute != null,
  }

  const getRouteItemProps = (path: string) => ({
    onPointerEnter: (event: PointerEvent<HTMLElement>) => handlePointerEnter(event, path),
  })

  const getGroupTriggerProps = (path: string) => ({
    onClickCapture: (event: MouseEvent<HTMLElement>) => handleGroupClickCapture(event, path),
    onPointerDownCapture: (event: PointerEvent<HTMLElement>) => handleGroupPointerDown(event, path),
    ...getRouteItemProps(path),
  })

  const hoverAreaProps = {
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== 'mouse') return

      clearCloseTimer()
    },
    onPointerLeave: handlePointerLeave,
  }

  return {
    close,
    getGroupTriggerProps,
    getRouteItemProps,
    hoverAreaProps,
    state,
  }
}
