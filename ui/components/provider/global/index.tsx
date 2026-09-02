'use client'

import dynamic from 'next/dynamic'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sileo'

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
      <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
        {children}
        <Toaster position="top-left" theme="system" />
      </ThemeProvider>
      <Analytics mode="production" />
      <SpeedInsights />
    </>
  )
}
