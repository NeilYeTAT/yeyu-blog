import { create } from 'zustand'

export const useStartupStore = create<{
  isPanelOpening: boolean
  isAnimationComplete: boolean
  setPanelOpening: (value: boolean) => void
  setAnimationComplete: (value: boolean) => void
}>(set => ({
  isPanelOpening: false,
  isAnimationComplete: false,
  setPanelOpening: value => set({ isPanelOpening: value }),
  setAnimationComplete: value => set({ isAnimationComplete: value }),
}))
