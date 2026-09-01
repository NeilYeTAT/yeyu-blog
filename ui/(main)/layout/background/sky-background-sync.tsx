'use client'

import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { useIsUsingRealTime, useSkyBackgroundActions } from '@/store/use-sky-background-store'
import { getMinutesOfDay } from './sky-background-time'

const millisecondsPerMinute = 60_000

export function SkyBackgroundSync() {
  const { resolvedTheme } = useTheme()
  const isUsingRealTime = useIsUsingRealTime()
  const { setDarkTheme, setRealTimeMinutesOfDay } = useSkyBackgroundActions()

  useEffect(() => {
    setDarkTheme(resolvedTheme === 'dark')
  }, [resolvedTheme, setDarkTheme])

  useEffect(() => {
    if (!isUsingRealTime) return

    let timeoutId = 0
    const syncRealTime = () => {
      const now = new Date()

      setRealTimeMinutesOfDay(getMinutesOfDay(now))
      timeoutId = window.setTimeout(
        syncRealTime,
        millisecondsPerMinute - now.getSeconds() * 1000 - now.getMilliseconds(),
      )
    }

    syncRealTime()

    return () => window.clearTimeout(timeoutId)
  }, [isUsingRealTime, setRealTimeMinutesOfDay])

  return null
}
