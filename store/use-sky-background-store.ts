import { create } from 'zustand'
import {
  getMinutesOfDay,
  getSkyBackgroundTimeState,
} from '@/ui/(main)/layout/background/sky-background-time'

const defaultMinutesOfDay = 11 * 60
const defaultCloudSpeed = 1
const defaultCloudAnimationRunning = true
const defaultUsingRealTime = true

const useSkyBackgroundStore = create<{
  cloudSpeed: number
  isBackgroundOnly: boolean
  isCloudAnimationRunning: boolean
  isInitialized: boolean
  isUsingRealTime: boolean
  previewMinutesOfDay: number
  realTimeMinutesOfDay: number
  actions: {
    initializeSkyBackground: (realTimeMinutesOfDay: number) => void
    resetSkyBackground: () => void
    setBackgroundOnly: (isBackgroundOnly: boolean) => void
    setCloudAnimationRunning: (isRunning: boolean) => void
    setCloudSpeed: (speed: number) => void
    setMinutesOfDay: (minutesOfDay: number) => void
    setRealTimeMinutesOfDay: (minutesOfDay: number) => void
    setUsingRealTime: (isUsingRealTime: boolean, minutesOfDay: number) => void
  }
}>(set => ({
  cloudSpeed: defaultCloudSpeed,
  isBackgroundOnly: false,
  isCloudAnimationRunning: defaultCloudAnimationRunning,
  isInitialized: false,
  isUsingRealTime: defaultUsingRealTime,
  previewMinutesOfDay: defaultMinutesOfDay,
  realTimeMinutesOfDay: defaultMinutesOfDay,
  actions: {
    initializeSkyBackground: realTimeMinutesOfDay => {
      set({
        isInitialized: true,
        realTimeMinutesOfDay,
      })
    },
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
export const useIsSkyBackgroundInitialized = () =>
  useSkyBackgroundStore(state => state.isInitialized)
export const useIsUsingRealTime = () => useSkyBackgroundStore(state => state.isUsingRealTime)
export const useSkyBackgroundActions = () => useSkyBackgroundStore(state => state.actions)

export const useSkyBackgroundTimeState = () => {
  const minutesOfDay = useSkyBackgroundStore(state => {
    if (!state.isUsingRealTime) return state.previewMinutesOfDay

    return state.realTimeMinutesOfDay
  })
  const timeState = getSkyBackgroundTimeState(minutesOfDay)

  return { minutesOfDay, timeState }
}
