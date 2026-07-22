import { useSyncExternalStore } from 'react'

const subscribe = () => () => undefined
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export const useIsMounted = () =>
  useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
