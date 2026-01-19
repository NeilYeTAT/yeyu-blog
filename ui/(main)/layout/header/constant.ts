import type { IModalType } from '@/store/use-modal-store'

export type NavRoute = {
  path: string
  pathName: string
  disabled?: boolean
  type?: 'link' | 'button'
  modal?: IModalType
}

export type NavGroup = {
  key: string
  mainPath?: string
  disabled?: boolean
  items: [NavRoute, ...NavRoute[]]
}

export type RouteItem = (NavRoute & { group?: never }) | { group: NavGroup }

export const navigationConfig: RouteItem[] = [
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
          disabled: true,
        },
        {
          path: '/tool',
          pathName: '工具',
          disabled: true,
        },
      ],
    },
  },
  // TODO: web3 login
  {
    group: {
      key: 'more',
      mainPath: '/login',
      items: [
        {
          path: '/login',
          pathName: '登录',
          type: 'button',
          modal: 'loginModal',
        },
        {
          path: '/todo',
          pathName: '等待',
          disabled: true,
        },
      ],
    },
  },
  {
    path: '/about',
    pathName: '关于',
  },
]
