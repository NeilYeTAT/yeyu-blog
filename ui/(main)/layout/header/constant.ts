import type { NavRoute } from './types'

export const navigationConfig: NavRoute[] = [
  {
    path: '/blog',
    pathName: '日志',
    pattern: /^\/blog($|\/)/,
  },
  {
    path: '/mutter',
    pathName: '动态',
    pattern: /^\/mutter($|\/)/,
  },
  {
    path: '/friends',
    pathName: '友链',
    pattern: /^\/friends($|\/)/,
  },
  {
    path: '/login',
    pathName: '登录',
    pattern: /^\/login($|\/)/,
    type: 'button',
    modal: 'loginModal',
  },
]
