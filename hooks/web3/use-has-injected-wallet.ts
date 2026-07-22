import { useInjectedWalletDiscovery } from './use-injected-wallet-discovery'

export const useHasInjectedWallet = () => {
  const wallets = useInjectedWalletDiscovery()

  return wallets.length > 0
}
