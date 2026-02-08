import { create } from 'zustand'

export const useStartupStore = create<{
  isAnimationComplete: boolean
  setAnimationComplete: (value: boolean) => void
}>(set => ({
  isAnimationComplete: false,
  setAnimationComplete: value => set({ isAnimationComplete: value }),
}))
