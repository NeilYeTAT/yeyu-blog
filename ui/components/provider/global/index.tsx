'use client'

import { LazyMotion } from 'motion/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sileo'
import { BrandThemeInitializer } from './brand-theme-initializer'
import ReactQueryProvider from './react-query-provider'

const loadMotionFeatures = () => import('./motion-features').then(module => module.default)

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BrandThemeInitializer />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <LazyMotion features={loadMotionFeatures} strict>
          <ReactQueryProvider>
            {children}
            <Toaster position="top-center" />
          </ReactQueryProvider>
        </LazyMotion>
      </ThemeProvider>
    </>
  )
}
