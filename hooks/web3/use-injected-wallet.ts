import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getInjectedWalletChainId,
  type InjectedWallet,
  type InjectedWalletProvider,
  parseInjectedWalletChainId,
  requestInjectedWalletAccounts,
  signInjectedWalletMessage,
} from '@/lib/core/web3'
import { useInjectedWalletDiscovery } from './use-injected-wallet-discovery'

export const useInjectedWallet = () => {
  const wallets = useInjectedWalletDiscovery()
  const [provider, setProvider] = useState<InjectedWalletProvider>()
  const [account, setAccount] = useState<string>()
  const [chainId, setChainId] = useState<number>()
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (provider === undefined) {
      return
    }

    const handleAccountsChanged = (value: unknown) => {
      const accounts = Array.isArray(value) ? value : []
      const [nextAccount] = accounts

      setAccount(typeof nextAccount === 'string' ? nextAccount : undefined)
    }

    const handleChainChanged = (value: unknown) => {
      if (typeof value !== 'string' && typeof value !== 'number') {
        return
      }

      setChainId(parseInjectedWalletChainId(value))
    }

    provider.on?.('accountsChanged', handleAccountsChanged)
    provider.on?.('chainChanged', handleChainChanged)

    return () => {
      provider.removeListener?.('accountsChanged', handleAccountsChanged)
      provider.removeListener?.('chainChanged', handleChainChanged)
    }
  }, [provider])

  const connect = useCallback(async (wallet: InjectedWallet) => {
    setIsPending(true)

    return await (async () => {
      const walletProvider = wallet.provider

      setProvider(walletProvider)

      const accounts = await requestInjectedWalletAccounts({ provider: walletProvider })
      const [nextAccount] = accounts

      if (nextAccount === undefined) {
        return undefined
      }

      const nextChainId = await getInjectedWalletChainId({ provider: walletProvider })

      setAccount(nextAccount)
      setChainId(nextChainId)

      return {
        account: nextAccount,
        chainId: nextChainId,
        provider: walletProvider,
      }
    })().finally(() => {
      setIsPending(false)
    })
  }, [])

  const signMessage = useCallback(
    async ({
      account,
      message,
      provider: walletProvider,
    }: {
      account: string
      message: string
      provider?: InjectedWalletProvider
    }) => {
      return await signInjectedWalletMessage({
        account,
        message,
        provider: walletProvider ?? provider,
      })
    },
    [provider],
  )

  return useMemo(
    () => ({
      account,
      chainId,
      connect,
      hasWallet: wallets.length > 0,
      isConnected: account !== undefined,
      isPending,
      signMessage,
      wallets,
    }),
    [account, chainId, connect, isPending, signMessage, wallets],
  )
}
