import { useEffect, useState } from 'react'
import {
  getAnnouncedWallet,
  getInjectedWallets,
  type InjectedWallet,
  providerAnnouncementEventName,
  providerRequestEventName,
} from '@/lib/core/web3'

const getWalletTextKey = (value?: string) => value?.trim().toLowerCase()

const isSameInjectedWallet = (currentWallet: InjectedWallet, wallet: InjectedWallet) => {
  const currentRdns = getWalletTextKey(currentWallet.rdns)
  const nextRdns = getWalletTextKey(wallet.rdns)
  const currentName = getWalletTextKey(currentWallet.name)
  const nextName = getWalletTextKey(wallet.name)
  const hasSpecificName = currentName !== undefined && currentName !== 'browser wallet'

  return (
    currentWallet.provider === wallet.provider ||
    currentWallet.id === wallet.id ||
    (currentRdns !== undefined && currentRdns === nextRdns) ||
    (hasSpecificName && currentName === nextName)
  )
}

let discoveredWallets: InjectedWallet[] = []
let hasStartedWalletDiscovery = false

const walletListeners = new Set<(wallets: InjectedWallet[]) => void>()

const notifyWalletListeners = () => {
  walletListeners.forEach(listener => listener(discoveredWallets))
}

const addWallet = (wallet: InjectedWallet) => {
  const matchedWalletIndex = discoveredWallets.findIndex(currentWallet =>
    isSameInjectedWallet(currentWallet, wallet),
  )

  if (matchedWalletIndex >= 0) {
    discoveredWallets = discoveredWallets.map((currentWallet, index) =>
      index === matchedWalletIndex
        ? {
            ...currentWallet,
            ...wallet,
            icon: wallet.icon ?? currentWallet.icon,
            rdns: wallet.rdns ?? currentWallet.rdns,
          }
        : currentWallet,
    )
  } else {
    discoveredWallets = [...discoveredWallets, wallet]
  }

  notifyWalletListeners()
}

const handleProviderAnnouncement = (event: Event) => {
  const announcedWallet = getAnnouncedWallet(event)

  if (announcedWallet !== undefined) {
    addWallet(announcedWallet)
  }
}

const startWalletDiscovery = () => {
  if (hasStartedWalletDiscovery) {
    return
  }

  hasStartedWalletDiscovery = true
  window.addEventListener(providerAnnouncementEventName, handleProviderAnnouncement)
  getInjectedWallets().forEach(addWallet)
  window.dispatchEvent(new Event(providerRequestEventName))
}

const subscribeToWallets = (listener: (wallets: InjectedWallet[]) => void) => {
  walletListeners.add(listener)
  startWalletDiscovery()
  listener(discoveredWallets)

  return () => {
    walletListeners.delete(listener)
  }
}

export const useInjectedWalletDiscovery = () => {
  const [wallets, setWallets] = useState<InjectedWallet[]>([])

  useEffect(() => subscribeToWallets(setWallets), [])

  return wallets
}
