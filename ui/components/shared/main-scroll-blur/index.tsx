'use client'

import { useEffect, useState } from 'react'
import { subscribeScrollContainer } from '@/lib/utils/common/scroll-container-store'

export function MainScrollBlur() {
  const [hasContentBelow, setHasContentBelow] = useState(false)

  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>('[data-main-scroll-container]')

    if (scrollContainer == null) return

    return subscribeScrollContainer(
      scrollContainer,
      ({ clientHeight, scrollHeight, scrollTop }) => {
        const remainingScroll = scrollHeight - scrollTop - clientHeight

        setHasContentBelow(remainingScroll > 1)
      },
    )
  }, [])

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-3 bottom-3 z-20 h-16 select-none rounded-b-lg bg-[linear-gradient(transparent,rgba(255,255,255,0.9))] backdrop-blur-[10px] transition-opacity duration-300 [-webkit-mask-image:linear-gradient(to_top,black_40%,transparent)] [mask-image:linear-gradient(to_top,black_40%,transparent)] motion-reduce:transition-none sm:inset-x-5 sm:bottom-5 dark:bg-[linear-gradient(transparent,rgba(0,0,0,0.85))] ${hasContentBelow ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}
