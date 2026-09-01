'use client'

import { Background } from './background'
import { useSkyBackground } from './background/sky-background-context'
import { DraggableFloatingMenu } from './draggable-floating-menu'

export function MainStage({ children }: { children: React.ReactNode }) {
  const { isBackgroundOnly } = useSkyBackground()

  return (
    <div className="relative isolate flex h-dvh max-w-screen overflow-hidden p-3 text-black transition-colors duration-300 ease-out sm:p-5 dark:text-white">
      {!isBackgroundOnly && children}
      <Background />
      <DraggableFloatingMenu />
    </div>
  )
}
