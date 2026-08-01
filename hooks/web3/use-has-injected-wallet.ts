import { useInjectedWallets } from './use-injected-wallet-discovery'

export const useHasInjectedWallet = () => {
  const wallets = useInjectedWallets()

  return wallets.length > 0
}
