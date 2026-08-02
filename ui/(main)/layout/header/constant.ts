import type { NavGroup, NavRoute, RouteItem } from './types'

export const activeTextShadowClass =
  '[text-shadow:0.03em_0_0_currentColor,-0.03em_0_0_currentColor]'
export const inactiveTextShadowClass = '[text-shadow:0_0_0_transparent]'
export const headerWaveTriggerClassName = 'group/header-wave'
export const headerWaveUnderlineClassName = `relative after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[5px] after:bg-current after:content-[''] after:[clip-path:inset(0_100%_0_0)] after:transition-[clip-path] after:duration-300 after:ease-out after:[mask-image:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='12'%20height='5'%20viewBox='0%200%2012%205'%3E%3Cpath%20d='M0%202.5C1.5%201.2%204.5%201.2%206%202.5s4.5%201.3%206%200'%20fill='none'%20stroke='black'%20stroke-width='1.25'/%3E%3C/svg%3E")] after:[mask-position:left_bottom] after:[mask-repeat:repeat-x] after:[mask-size:12px_5px] group-hover/header-wave:after:[clip-path:inset(0)] group-focus-visible/header-wave:after:[clip-path:inset(0)] motion-reduce:after:transition-none`

export const slideVariants = {
  enter: (direction: number) => ({
    x: direction === 0 ? 0 : direction > 0 ? 16 : -16,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction === 0 ? 0 : direction < 0 ? 16 : -16,
    opacity: 0,
  }),
}

export const navigationConfig: RouteItem[] = [
  {
    path: '/',
    pathName: '首页',
    pattern: /^\/$/,
  },
  {
    group: {
      key: 'hand note',
      mainPath: '/blog',
      items: [
        {
          path: '/note',
          pathName: '笔记',
          pattern: /^\/note($|\/)/,
        },
        {
          path: '/blog',
          pathName: '日志',
          pattern: /^\/blog($|\/)/,
        },
      ],
    },
  },
  {
    group: {
      key: 'mutter',
      mainPath: '/mutter',
      items: [
        {
          path: '/mutter',
          pathName: '低语',
          pattern: /^\/mutter($|\/)/,
        },
        {
          path: '/friends',
          pathName: '友链',
          pattern: /^\/friends($|\/)/,
        },
      ],
    },
  },
  {
    group: {
      key: 'more',
      mainPath: '/login',
      items: [
        {
          path: '/login',
          pathName: '登录',
          pattern: /^\/login($|\/)/,
          type: 'button',
          modal: 'loginModal',
        },
        {
          path: '/todo',
          pathName: '等待',
          pattern: /^\/todo($|\/)/,
          disabled: true,
        },
      ],
    },
  },
  {
    path: '/about',
    pathName: '关于',
    pattern: /^\/about($|\/)/,
  },
]

export const isNavGroupRoute = (
  route: RouteItem,
): route is Extract<RouteItem, { group: NavGroup }> => {
  return 'group' in route && route.group != null
}

export const flatNavRoutes = navigationConfig.flatMap(route =>
  isNavGroupRoute(route) ? route.group.items : [route],
)

const navGroupRoutes = navigationConfig.filter(isNavGroupRoute)

export const navGroupIndexMap = new Map<string, number>(
  navGroupRoutes.map((route, index) => [route.group.key, index] as const),
)

export const navGroupRouteMap = new Map<string, Extract<RouteItem, { group: NavGroup }>>(
  navGroupRoutes.map(route => [route.group.key, route] as const),
)

export const navRoutePathMap = new Map<string, NavRoute>(
  flatNavRoutes.map(route => [route.path, route] as const),
)

export const navRouteGroupMap = new Map<string, Extract<RouteItem, { group: NavGroup }>>(
  navGroupRoutes.flatMap(route => route.group.items.map(item => [item.path, route] as const)),
)
