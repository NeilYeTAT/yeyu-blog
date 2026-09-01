import { useMemo } from 'react'
import { create } from 'zustand'
import {
  getMinutesOfDay,
  getSkyBackgroundTimeState,
} from '@/ui/(main)/layout/background/sky-background-time'

const defaultMinutesOfDay = 12 * 60
const darkThemeMinutesOfDay = 22 * 60
const daytimeStartMinutes = 6 * 60
const daytimeEndMinutes = 18 * 60
const defaultCloudSpeed = 1
const defaultCloudAnimationRunning = true
const defaultUsingRealTime = true

const useSkyBackgroundStore = create<{
  cloudSpeed: number
  isBackgroundOnly: boolean
  isCloudAnimationRunning: boolean
  isDarkTheme: boolean
  isUsingRealTime: boolean
  previewMinutesOfDay: number
  realTimeMinutesOfDay: number
  actions: {
    resetSkyBackground: () => void
    setBackgroundOnly: (isBackgroundOnly: boolean) => void
    setCloudAnimationRunning: (isRunning: boolean) => void
    setCloudSpeed: (speed: number) => void
    setDarkTheme: (isDarkTheme: boolean) => void
    setMinutesOfDay: (minutesOfDay: number) => void
    setRealTimeMinutesOfDay: (minutesOfDay: number) => void
    setUsingRealTime: (isUsingRealTime: boolean, minutesOfDay: number) => void
  }
}>(set => ({
  cloudSpeed: defaultCloudSpeed,
  isBackgroundOnly: false,
  isCloudAnimationRunning: defaultCloudAnimationRunning,
  isDarkTheme: false,
  isUsingRealTime: defaultUsingRealTime,
  previewMinutesOfDay: defaultMinutesOfDay,
  realTimeMinutesOfDay: defaultMinutesOfDay,
  actions: {
    resetSkyBackground: () => {
      const nextMinutesOfDay = getMinutesOfDay(new Date())

      set({
        cloudSpeed: defaultCloudSpeed,
        isCloudAnimationRunning: defaultCloudAnimationRunning,
        isUsingRealTime: defaultUsingRealTime,
        previewMinutesOfDay: nextMinutesOfDay,
        realTimeMinutesOfDay: nextMinutesOfDay,
      })
    },
    setBackgroundOnly: isBackgroundOnly => set({ isBackgroundOnly }),
    setCloudAnimationRunning: isCloudAnimationRunning => set({ isCloudAnimationRunning }),
    setCloudSpeed: cloudSpeed => set({ cloudSpeed }),
    setDarkTheme: isDarkTheme => set({ isDarkTheme }),
    setMinutesOfDay: previewMinutesOfDay => {
      set({ isUsingRealTime: false, previewMinutesOfDay })
    },
    setRealTimeMinutesOfDay: realTimeMinutesOfDay => set({ realTimeMinutesOfDay }),
    setUsingRealTime: (isUsingRealTime, minutesOfDay) => {
      if (isUsingRealTime) {
        set({
          isUsingRealTime,
          realTimeMinutesOfDay: getMinutesOfDay(new Date()),
        })
        return
      }

      set({ isUsingRealTime, previewMinutesOfDay: minutesOfDay })
    },
  },
}))

export const useCloudSpeed = () => useSkyBackgroundStore(state => state.cloudSpeed)
export const useIsBackgroundOnly = () => useSkyBackgroundStore(state => state.isBackgroundOnly)
export const useIsCloudAnimationRunning = () =>
  useSkyBackgroundStore(state => state.isCloudAnimationRunning)
export const useIsUsingRealTime = () => useSkyBackgroundStore(state => state.isUsingRealTime)
export const useSkyBackgroundActions = () => useSkyBackgroundStore(state => state.actions)

export const useSkyBackgroundTimeState = () => {
  const minutesOfDay = useSkyBackgroundStore(state => {
    if (!state.isUsingRealTime) return state.previewMinutesOfDay

    const isDaytime =
      state.realTimeMinutesOfDay >= daytimeStartMinutes &&
      state.realTimeMinutesOfDay < daytimeEndMinutes

    return state.isDarkTheme && isDaytime ? darkThemeMinutesOfDay : state.realTimeMinutesOfDay
  })
  const timeState = useMemo(() => getSkyBackgroundTimeState(minutesOfDay), [minutesOfDay])

  return { minutesOfDay, timeState }
}
