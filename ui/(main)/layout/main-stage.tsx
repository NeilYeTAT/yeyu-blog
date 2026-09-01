'use client'

import { useIsBackgroundOnly } from '@/store/use-sky-background-store'
import { Background } from './background'
import { SkyBackgroundSync } from './background/sky-background-sync'
import { DraggableFloatingMenu } from './draggable-floating-menu'

export function MainStage({ children }: { children: React.ReactNode }) {
  const isBackgroundOnly = useIsBackgroundOnly()

  return (
    <div
      data-background-only={isBackgroundOnly ? '' : undefined}
      className="site-main-stage relative isolate flex h-dvh max-w-screen overflow-hidden p-3 text-black transition-colors duration-300 ease-out sm:p-5 dark:text-white"
    >
      <SkyBackgroundSync />
      {children}
      <Background />
      <DraggableFloatingMenu />
    </div>
  )
}
