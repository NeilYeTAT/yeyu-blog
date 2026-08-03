'use client'

import { useState } from 'react'
import { useHasInjectedWallet } from '@/hooks/web3/use-has-injected-wallet'
import { useSession } from '@/lib/core/auth/client'
import { isEmailLoggedIn, isWalletLoggedIn } from '@/lib/core/auth/utils'
import { cn } from '@/lib/utils/common/shadcn'
import { LoginPanel } from './login-panel'
import { WalletLoginSection } from './wallet-login-section'
import { Web2UserPanel } from './web2-user-panel'
import { Web3UserPanel } from './web3-user-panel'

export const LoginModalContent = () => {
  const hasInjectedWallet = useHasInjectedWallet()
  const [isWalletSigningIn, setIsWalletSigningIn] = useState(false)

  const { data: session } = useSession()
  const isWalletUser = isWalletLoggedIn({ data: session })
  const isEmailUser = isEmailLoggedIn({ data: session })
  const isLoginPending = isWalletSigningIn
  const hasWalletLogin = hasInjectedWallet && !isEmailUser && !isWalletUser

  return (
    <main
      className={cn(
        'grid gap-3 font-mono',
        !isLoginPending && hasWalletLogin ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1',
      )}
    >
      {isEmailUser ? (
        <Web2UserPanel />
      ) : isWalletUser ? (
        <Web3UserPanel />
      ) : (
        <>
          {!isLoginPending ? (
            <LoginPanel hasWalletLogin={hasWalletLogin} isActionPending={isLoginPending} />
          ) : null}
          {hasWalletLogin ? (
            <WalletLoginSection
              isLoginPending={isLoginPending}
              setIsWalletSigningIn={setIsWalletSigningIn}
            />
          ) : null}
        </>
      )}
    </main>
  )
}
