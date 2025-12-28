'use client'

// * thanks https://hypercolor.dev/
import type { ComponentProps, FC } from 'react'
import { useTransitionTheme } from '@/lib/hooks/animation'
import { cn } from '@/lib/utils/common/shadcn'

export const Background: FC<ComponentProps<'div'>> = () => {
  const { resolvedTheme } = useTransitionTheme()
  if (resolvedTheme === 'light') {
    return (
      <>
        <div
          className={cn(
            'pointer-events-none fixed top-0 left-0 -z-20 min-h-screen w-screen',
            'bg-[radial-gradient(ellipse_at_bottom,#38bdf8,#bae6fd)] opacity-45',
          )}
        />
        <svg className="pointer-events-none fixed -z-10 size-0">
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        <div
          className={cn(
            'pointer-events-none fixed top-0 left-0 -z-10 min-h-screen w-screen',
            'opacity-25 filter-[url(#grain)]',
          )}
        />
      </>
    )
  }

  return null
}
