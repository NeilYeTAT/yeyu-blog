'use client'

import { useTheme } from 'next-themes'
import { useEffect, useLayoutEffect } from 'react'
import {
  useIsSkyBackgroundInitialized,
  useIsUsingRealTime,
  useSkyBackgroundActions,
} from '@/store/use-sky-background-store'
import { getMinutesOfDay } from './sky-background-time'

const millisecondsPerMinute = 60_000

export function SkyBackgroundSync() {
  const { resolvedTheme } = useTheme()
  const isInitialized = useIsSkyBackgroundInitialized()
  const isUsingRealTime = useIsUsingRealTime()
  const { initializeSkyBackground, setDarkTheme, setRealTimeMinutesOfDay } =
    useSkyBackgroundActions()

  useLayoutEffect(() => {
    const now = new Date()

    initializeSkyBackground(
      document.documentElement.classList.contains('dark'),
      getMinutesOfDay(now),
    )
  }, [initializeSkyBackground])

  useEffect(() => {
    if (!isInitialized || resolvedTheme === undefined) return

    setDarkTheme(resolvedTheme === 'dark')
  }, [isInitialized, resolvedTheme, setDarkTheme])

  useEffect(() => {
    if (!isInitialized || !isUsingRealTime) return

    let timeoutId = 0
    const scheduleNextSync = () => {
      const now = new Date()

      timeoutId = window.setTimeout(
        () => {
          setRealTimeMinutesOfDay(getMinutesOfDay(new Date()))
          scheduleNextSync()
        },
        millisecondsPerMinute - now.getSeconds() * 1000 - now.getMilliseconds(),
      )
    }

    scheduleNextSync()

    return () => window.clearTimeout(timeoutId)
  }, [isInitialized, isUsingRealTime, setRealTimeMinutesOfDay])

  return null
}
