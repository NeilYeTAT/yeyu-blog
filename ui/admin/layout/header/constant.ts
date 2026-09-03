export const adminRoutes: { path: string; pathName: string; pattern: RegExp }[] = [
  {
    path: '/admin',
    pathName: '首页',
    pattern: /^\/admin$/,
  },
  {
    path: '/admin/blog',
    pathName: '博客',
    pattern: /^\/admin\/blog($|\/)/,
  },
  {
    path: '/admin/tag',
    pathName: '标签',
    pattern: /^\/admin\/tag($|\/)/,
  },
  {
    path: '/admin/friend-link',
    pathName: '友链',
    pattern: /^\/admin\/friend-link($|\/)/,
  },
  {
    path: '/admin/comment',
    pathName: '评论',
    pattern: /^\/admin\/comment($|\/)/,
  },
]
