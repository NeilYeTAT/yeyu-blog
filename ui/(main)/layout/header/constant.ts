import type { NavRoute } from './types'

export const navigationConfig: NavRoute[] = [
  {
    path: '/blog',
    pathName: 'blog',
    pattern: /^\/blog($|\/)/,
  },
  {
    path: '/friends',
    pathName: 'friends',
    pattern: /^\/friends($|\/)/,
  },
  {
    path: '/login',
    pathName: 'login',
    pattern: /^\/login($|\/)/,
    type: 'button',
    modal: 'loginModal',
  },
  {
    path: '/language',
    pathName: 'language',
    pattern: /^\/language($|\/)/,
    type: 'button',
  },
]
