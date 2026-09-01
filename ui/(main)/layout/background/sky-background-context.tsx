'use client'

import { useTheme } from 'next-themes'
import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react'
import { getMinutesOfDay, getSkyBackgroundTimeState } from './sky-background-time'

const defaultMinutesOfDay = 12 * 60
const darkThemeMinutesOfDay = 22 * 60
const daytimeStartMinutes = 6 * 60
const daytimeEndMinutes = 18 * 60
const defaultCloudSpeed = 1
const defaultCloudAnimationRunning = true
const defaultUsingRealTime = true

const SkyBackgroundContext = createContext<
  | {
      cloudSpeed: number
      isBackgroundOnly: boolean
      isCloudAnimationRunning: boolean
      isUsingRealTime: boolean
      minutesOfDay: number
      timeState: ReturnType<typeof getSkyBackgroundTimeState>
      resetSkyBackground: () => void
      setBackgroundOnly: (isBackgroundOnly: boolean) => void
      setCloudAnimationRunning: (isRunning: boolean) => void
      setCloudSpeed: (speed: number) => void
      setMinutesOfDay: (minutesOfDay: number) => void
      setUsingRealTime: (isUsingRealTime: boolean) => void
    }
  | undefined
>(undefined)

export function SkyBackgroundProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [realTimeMinutesOfDay, setRealTimeMinutesOfDay] = useState(defaultMinutesOfDay)
  const [previewMinutesOfDay, setPreviewMinutesOfDay] = useState(defaultMinutesOfDay)
  const [isUsingRealTime, setIsUsingRealTime] = useState(defaultUsingRealTime)
  const [cloudSpeed, setCloudSpeed] = useState(defaultCloudSpeed)
  const [isBackgroundOnly, setBackgroundOnly] = useState(false)
  const [isCloudAnimationRunning, setCloudAnimationRunning] = useState(defaultCloudAnimationRunning)
  const isDaytime =
    realTimeMinutesOfDay >= daytimeStartMinutes && realTimeMinutesOfDay < daytimeEndMinutes
  const themeAdjustedRealTimeMinutesOfDay =
    isDarkTheme && isDaytime ? darkThemeMinutesOfDay : realTimeMinutesOfDay
  const minutesOfDay = isUsingRealTime ? themeAdjustedRealTimeMinutesOfDay : previewMinutesOfDay
  const timeState = useMemo(() => getSkyBackgroundTimeState(minutesOfDay), [minutesOfDay])

  useEffect(() => {
    setIsDarkTheme(resolvedTheme === 'dark')
  }, [resolvedTheme])

  useEffect(() => {
    const syncRealTime = () => {
      const nextMinutesOfDay = getMinutesOfDay(new Date())

      setRealTimeMinutesOfDay(nextMinutesOfDay)
      if (isUsingRealTime) setPreviewMinutesOfDay(nextMinutesOfDay)
    }

    syncRealTime()
    const intervalId = window.setInterval(syncRealTime, 60_000)

    return () => window.clearInterval(intervalId)
  }, [isUsingRealTime])

  const setMinutesOfDay = useCallback((nextMinutesOfDay: number) => {
    setIsUsingRealTime(false)
    setPreviewMinutesOfDay(nextMinutesOfDay)
  }, [])

  const setUsingRealTime = useCallback(
    (nextIsUsingRealTime: boolean) => {
      setIsUsingRealTime(nextIsUsingRealTime)

      if (nextIsUsingRealTime) {
        const nextMinutesOfDay = getMinutesOfDay(new Date())

        setRealTimeMinutesOfDay(nextMinutesOfDay)
        setPreviewMinutesOfDay(nextMinutesOfDay)
        return
      }

      setPreviewMinutesOfDay(minutesOfDay)
    },
    [minutesOfDay],
  )

  const resetSkyBackground = useCallback(() => {
    const nextMinutesOfDay = getMinutesOfDay(new Date())

    setRealTimeMinutesOfDay(nextMinutesOfDay)
    setPreviewMinutesOfDay(nextMinutesOfDay)
    setIsUsingRealTime(defaultUsingRealTime)
    setCloudSpeed(defaultCloudSpeed)
    setCloudAnimationRunning(defaultCloudAnimationRunning)
  }, [])

  const value = useMemo(
    () => ({
      cloudSpeed,
      isBackgroundOnly,
      isCloudAnimationRunning,
      isUsingRealTime,
      minutesOfDay,
      timeState,
      resetSkyBackground,
      setBackgroundOnly,
      setCloudAnimationRunning,
      setCloudSpeed,
      setMinutesOfDay,
      setUsingRealTime,
    }),
    [
      cloudSpeed,
      isBackgroundOnly,
      isCloudAnimationRunning,
      isUsingRealTime,
      minutesOfDay,
      resetSkyBackground,
      setMinutesOfDay,
      setUsingRealTime,
      timeState,
    ],
  )

  return <SkyBackgroundContext value={value}>{children}</SkyBackgroundContext>
}

export function useSkyBackground() {
  const context = use(SkyBackgroundContext)

  if (context === undefined) {
    throw new Error('useSkyBackground must be used within SkyBackgroundProvider')
  }

  return context
}
