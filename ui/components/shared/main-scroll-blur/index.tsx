'use client'

import { useEffect, useState } from 'react'

export function MainScrollBlur() {
  const [hasContentBelow, setHasContentBelow] = useState(false)

  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>('[data-main-scroll-container]')

    if (scrollContainer == null) return

    const updateVisibility = () => {
      const remainingScroll =
        scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight

      setHasContentBelow(remainingScroll > 1)
    }

    const resizeObserver = new ResizeObserver(updateVisibility)
    const scrollContent = scrollContainer.firstElementChild

    resizeObserver.observe(scrollContainer)
    if (scrollContent instanceof HTMLElement) resizeObserver.observe(scrollContent)

    scrollContainer.addEventListener('scroll', updateVisibility, { passive: true })
    updateVisibility()

    return () => {
      resizeObserver.disconnect()
      scrollContainer.removeEventListener('scroll', updateVisibility)
    }
  }, [])

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-3 bottom-3 z-20 h-16 select-none rounded-b-lg bg-[linear-gradient(transparent,rgba(255,255,255,0.9))] backdrop-blur-[10px] transition-opacity duration-300 [-webkit-mask-image:linear-gradient(to_top,black_40%,transparent)] [mask-image:linear-gradient(to_top,black_40%,transparent)] motion-reduce:transition-none sm:inset-x-5 sm:bottom-5 dark:bg-[linear-gradient(transparent,rgba(0,0,0,0.85))] ${hasContentBelow ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}
