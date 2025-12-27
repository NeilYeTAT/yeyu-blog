'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useRef } from 'react'
import { useIndicatorPosition } from '@/lib/hooks/animation'
import { getActiveMainPath } from '@/lib/url'
import { cn } from '@/lib/utils/common/shadcn'
import { MaxWidthWrapper } from '../components/shared/max-width-wrapper'

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

export default function MainHeader() {
  const pathname = usePathname()
  const activeUrl = getActiveMainPath(pathname)
  const refs = useRef(new Map<string, HTMLAnchorElement>())

  const indicatorStyle = useIndicatorPosition(activeUrl, refs)

  return (
    <header className="sticky top-3 z-20 mb-4 flex h-12 items-center justify-center backdrop-blur-sm">
      <MaxWidthWrapper
        className={cn(
          // TODO: config other colors
          'flex h-full items-center justify-center rounded-full bg-indigo-200/40 py-2',
          'border border-[#00000011] dark:border-[#FFFFFF1A]',
          'shadow-[0px_4px_10px_0px_#0000001A]',
        )}
      >
        <nav className="relative flex gap-8 md:gap-16">
          {RouteList.map(route => (
            <Fragment key={route.path}>
              <Link
                href={route.path}
                ref={el => {
                  if (el != null) refs.current.set(route.path, el)
                }}
                className={cn(
                  'relative z-10 px-4 md:text-xl',
                  route.path === activeUrl && 'font-bold',
                )}
              >
                <h2>{route.pathName}</h2>
              </Link>
            </Fragment>
          ))}
          {/* TODO: Web3 Login */}
          <div>登录</div>

          <motion.div
            className="absolute top-1/2 -translate-y-1/2 rounded-full bg-indigo-600"
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
