'use client'

import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import { useIndicatorPosition } from '@/lib/hooks/animation'
import { getActiveMainPath } from '@/lib/url'
import { cn } from '@/lib/utils/common/shadcn'
import { MaxWidthWrapper } from '../components/shared/max-width-wrapper'

const RouteList: { path: string; pathName: string }[] = [
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
    path: '/refer',
    pathName: '参考',
  },
  {
    path: '/about',
    pathName: '关于',
  },
]

export default function MainHeader() {
  const pathname = usePathname()
  const activeUrl = getActiveMainPath(pathname)
  const refs = useRef(new Map<string, HTMLAnchorElement>())
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)

  const indicatorStyle = useIndicatorPosition(activeUrl, refs)

  return (
    <header className="sticky top-3 z-20 mx-auto mb-4 flex h-9 w-3/4 items-center justify-center md:h-12 md:w-1/2 lg:w-5/12">
      <MaxWidthWrapper
        className={cn(
          // TODO: config other colors
          'bg-clear-sky-background/80 h-full rounded-full backdrop-blur-sm dark:bg-black/70',
          'px-2.5 py-1 md:px-3 md:py-2',
          'border border-[#00000011] dark:border-white/10',
          'shadow-[0px_4px_10px_0px_#0000001A]',
          'w-full',
        )}
      >
        <nav className="relative flex h-full items-center justify-between text-sm text-nowrap md:text-xl dark:text-neutral-400">
          {RouteList.map(route => (
            <Link
              key={route.path}
              href={route.path}
              ref={el => {
                if (el != null) refs.current.set(route.path, el)
              }}
              className={cn(
                'relative z-10 px-2 transition-colors md:px-4',
                route.path === activeUrl
                  ? 'text-clear-sky-active-text font-bold dark:text-black'
                  : 'dark:hover:text-neutral-200',
              )}
              onMouseEnter={() => setHoveredPath(route.path)}
              onMouseLeave={() => setHoveredPath(null)}
            >
              <h2>{route.pathName}</h2>
              <HoverBackground
                isVisible={hoveredPath !== activeUrl && hoveredPath === route.path}
              />
            </Link>
          ))}
          {/* TODO: Web3 Login */}
          {/* <div
            className="relative z-10 cursor-pointer px-2 md:px-4"
            onMouseEnter={() => setHoveredPath('login')}
            onMouseLeave={() => setHoveredPath(null)}
          >
            登录
            <HoverBackground isVisible={hoveredPath === 'login'} />
          </div> */}

          <motion.div
            className="bg-clear-sky-indicator absolute top-1/2 -translate-y-1/2 rounded-full shadow-md dark:bg-white"
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

function HoverBackground({ isVisible }: { isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          layoutId="hoverBackground"
          className="absolute -inset-x-1 -inset-y-0.5 -z-10 rounded-full bg-white/60 shadow-sm dark:bg-neutral-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        />
      )}
    </AnimatePresence>
  )
}
