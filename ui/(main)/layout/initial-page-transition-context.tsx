'use client'

import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

const initialPageTransitionContext = createContext<boolean | null>(null)

export function InitialPageTransitionProvider({
  children,
  isPageRevealing,
}: {
  children: ReactNode
  isPageRevealing: boolean
}) {
  return (
    <initialPageTransitionContext.Provider value={isPageRevealing}>
      {children}
    </initialPageTransitionContext.Provider>
  )
}

export function useInitialPageTransition() {
  const isPageRevealing = useContext(initialPageTransitionContext)

  if (isPageRevealing === null) {
    throw new Error('useInitialPageTransition must be used within InitialPageTransition')
  }

  return isPageRevealing
}
