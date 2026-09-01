import { create } from 'zustand'

const useHomeLoadingStore = create<{
  hasCompletedHomeLoading: boolean
  actions: {
    completeHomeLoading: () => void
  }
}>(set => ({
  hasCompletedHomeLoading: false,
  actions: {
    completeHomeLoading: () => set({ hasCompletedHomeLoading: true }),
  },
}))

export const useHasCompletedHomeLoading = () =>
  useHomeLoadingStore(state => state.hasCompletedHomeLoading)
export const useHomeLoadingActions = () => useHomeLoadingStore(state => state.actions)
