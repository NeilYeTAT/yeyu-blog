export function getRoutePathname(pathname: string) {
  const routePathname = pathname.replace(/^\/(?:zh|en)(?=\/|$)/, '')

  return routePathname === '' ? '/' : routePathname
}
