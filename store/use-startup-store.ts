import { create } from 'zustand'

const useStartupStore = create<{
  isPanelOpening: boolean
  isAnimationComplete: boolean
  actions: {
    setPanelOpening: (value: boolean) => void
    setAnimationComplete: (value: boolean) => void
  }
}>(set => ({
  isPanelOpening: false,
  isAnimationComplete: false,
  actions: {
    setPanelOpening: value => set({ isPanelOpening: value }),
    setAnimationComplete: value => set({ isAnimationComplete: value }),
  },
}))

export const useIsPanelOpening = () => useStartupStore(state => state.isPanelOpening)
export const useIsAnimationComplete = () => useStartupStore(state => state.isAnimationComplete)
export const useStartupActions = () => useStartupStore(state => state.actions)
