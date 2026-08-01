import { useSyncExternalStore } from 'react'

const subscribe = () => () => undefined
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export const useIsHydrated = () =>
  useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
