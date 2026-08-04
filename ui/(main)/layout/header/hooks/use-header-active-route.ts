import type { NavGroup } from '../types'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useModalActions, useModalType } from '@/store/use-modal-store'
import { flatNavRoutes, navRouteGroupMap, navRoutePathMap } from '../constant'

export const useHeaderActiveRoute = () => {
  const pathname = usePathname()
  const modalType = useModalType()
  const { closeModal } = useModalActions()

  useEffect(() => {
    closeModal()
  }, [closeModal])

  const activeUrl = flatNavRoutes.find(route => route.pattern.test(pathname))?.path ?? pathname
  const modalRoute =
    modalType == null ? undefined : flatNavRoutes.find(route => route.modal === modalType)
  const effectiveActiveUrl = modalRoute?.path ?? activeUrl
  const activeRouteGroup = navRouteGroupMap.get(effectiveActiveUrl)

  const [routeHistory, setRouteHistory] = useState<{
    activeUrl: string
    groupLastActivePaths: Record<string, string>
  }>(() => ({
    activeUrl: effectiveActiveUrl,
    groupLastActivePaths:
      activeRouteGroup == null ? {} : { [activeRouteGroup.group.key]: effectiveActiveUrl },
  }))

  if (routeHistory.activeUrl !== effectiveActiveUrl) {
    setRouteHistory({
      activeUrl: effectiveActiveUrl,
      groupLastActivePaths:
        activeRouteGroup == null
          ? routeHistory.groupLastActivePaths
          : {
              ...routeHistory.groupLastActivePaths,
              [activeRouteGroup.group.key]: effectiveActiveUrl,
            },
    })
  }

  const activeKey =
    activeRouteGroup?.group.key ??
    navRoutePathMap.get(effectiveActiveUrl)?.path ??
    effectiveActiveUrl

  const getGroupCurrentItem = (group: NavGroup) => {
    const activeItem = group.items.find(item => item.path === effectiveActiveUrl)

    if (activeItem != null) return activeItem

    const lastActivePath = routeHistory.groupLastActivePaths[group.key]
    const lastActiveItem = group.items.find(item => item.path === lastActivePath)

    if (lastActiveItem != null) return lastActiveItem

    const mainItem =
      group.mainPath == null ? undefined : group.items.find(item => item.path === group.mainPath)

    return mainItem ?? group.items[0]
  }

  return {
    activeKey,
    effectiveActiveUrl,
    getGroupCurrentItem,
  }
}
