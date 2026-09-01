import { create } from 'zustand'

const useInitialPageTransitionStore = create<{
  isPageReady: boolean
  actions: {
    completeInitialPageTransition: () => void
  }
}>(set => ({
  isPageReady: false,
  actions: {
    completeInitialPageTransition: () => set({ isPageReady: true }),
  },
}))

export const useIsInitialPageReady = () => useInitialPageTransitionStore(state => state.isPageReady)
export const useInitialPageTransitionActions = () =>
  useInitialPageTransitionStore(state => state.actions)
