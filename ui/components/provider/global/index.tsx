'use client'

import dynamic from 'next/dynamic'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sileo'
import { BrandThemeInitializer } from './brand-theme-initializer'
import ReactQueryProvider from './react-query-provider'

const Analytics = dynamic(() => import('@vercel/analytics/react').then(m => m.Analytics), {
  ssr: false,
})

const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/next').then(m => m.SpeedInsights),
  {
    ssr: false,
  },
)

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BrandThemeInitializer />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <ReactQueryProvider>
          {children}
          <Toaster position="top-center" theme="system" />
        </ReactQueryProvider>
      </ThemeProvider>
      <Analytics mode="production" />
      <SpeedInsights />
    </>
  )
}
