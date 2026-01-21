import type React from 'react'
import LenisScrollProvider from './lenis-scroll-provider'
import { MainModalProvider } from './main-modal-provider'

export default function MainProvider({ children }: { children: React.ReactNode }) {
  return (
    <LenisScrollProvider>
      <MainModalProvider>{children}</MainModalProvider>
    </LenisScrollProvider>
  )
}
