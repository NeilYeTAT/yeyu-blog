'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useRef } from 'react'
import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import { useIndicatorPosition } from '@/hooks/use-indicator-position'
import { getActiveMainPath } from '@/lib/url'
import { cn } from '@/lib/utils'

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
  const refs = useRef(new Map<string, HTMLAnchorElement>())

  const indicatorStyle = useIndicatorPosition(activeUrl, refs)

  return (
    <header className="dark:border-b-accent sticky top-0 z-20 flex h-14 items-center justify-center border-b border-dashed border-b-indigo-200 backdrop-blur-lg">
      <MaxWidthWrapper className="flex items-center justify-center">
        <nav className="relative flex gap-8 md:gap-16">
          {RouteList.map(route => (
            <Fragment key={route.path}>
              <Link
                href={route.path}
                ref={el => {
                  if (el != null) refs.current.set(route.path, el)
                }}
                className={cn(
                  'relative px-4 md:text-xl',
                  route.path === activeUrl && 'font-bold text-purple-600 dark:text-emerald-300',
                )}
              >
                <h2>{route.pathName}</h2>
              </Link>
            </Fragment>
          ))}

          {/* 指示条 */}
          <motion.div
            className="absolute bottom-0 h-[2px] rounded-full bg-purple-600 dark:bg-emerald-300"
            animate={indicatorStyle}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 16,
            }}
          />
        </nav>
      </MaxWidthWrapper>
    </header>
  )
}
