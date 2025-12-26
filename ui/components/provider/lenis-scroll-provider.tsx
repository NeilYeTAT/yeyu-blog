'use client'

import type { FC } from 'react'
import { ReactLenis } from 'lenis/react'

interface LenisScrollProviderProps {
  children: React.ReactNode
}

// copy from https://easings.net/en#easeOutQuint
// https://easings.net/en
function easeOutQuint(x: number): number {
  return 1 - (1 - x) ** 5
}

const LenisScrollProvider: FC<LenisScrollProviderProps> = ({ children }) => {
  return (
    <ReactLenis
      options={{
        easing: easeOutQuint,
      }}
      root
    >
      {children}
    </ReactLenis>
  )
}

export default LenisScrollProvider
