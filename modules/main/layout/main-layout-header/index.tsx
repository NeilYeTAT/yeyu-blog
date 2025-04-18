'use client'

import { cn } from '@/lib/utils'
import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'
import { motion } from 'motion/react'
import { getActiveMainPath } from '@/lib/url'

const RouteList = [
  {
    path: '/',
    pathName: '首页',
  },
  {
    path: '/blog',
    pathName: '博客',
  },
  {
    path: '/note',
    pathName: '笔记',
  },
  {
    path: '/about',
    pathName: '关于',
  },
] as const

export default function MainLayoutHeader() {
  const pathname = usePathname()
  const activeUrl = getActiveMainPath(pathname)

  return (
    <header
      className="h-14 flex items-center justify-center sticky top-0 backdrop-blur-lg z-20
                  border-b border-dashed dark:border-b-accent border-b-indigo-200"
    >
      <MaxWidthWrapper className="flex items-center justify-center">
        <nav className="flex md:gap-16 gap-8">
          {RouteList.map(route => (
            <Fragment key={route.path}>
              <Link
                href={route.path}
                className={cn(
                  'relative md:text-xl px-4',
                  route.path === activeUrl &&
                    'text-purple-600 dark:text-emerald-300 font-bold',
                )}
              >
                <h2>{route.pathName}</h2>
                {route.path === activeUrl && (
                  <motion.span
                    className={cn(
                      'absolute h-[2px] w-full left-0 bottom-0 bg-purple-600 dark:bg-emerald-300 rounded-full',
                      // pathname === '/' && 'bg-indigo-400',
                      // pathname === '/blog' && 'bg-pink-400',
                      // pathname === '/note' && 'bg-blue-500',
                      // pathname === '/about' && 'bg-purple-400',
                    )}
                    layoutId="route-list-bottom-line"
                  />
                )}
              </Link>
            </Fragment>
          ))}
        </nav>
      </MaxWidthWrapper>
    </header>
  )
}
