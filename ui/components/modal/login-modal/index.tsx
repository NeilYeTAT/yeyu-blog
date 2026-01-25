'use client'

import type { ComponentProps, FC } from 'react'
import { Loader2, Wallet2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SiweMessage } from 'siwe'
import { useChainId, useChains, useConnect, useConnections, useConnectors } from 'wagmi'
import { disconnect, signMessage } from 'wagmi/actions'
import { ADMIN_WALLET_ADDRESS } from '@/config/constant'
import { authClient, signIn, signOut, useSession } from '@/lib/auth/client'
import { isEmailLoggedIn, isWalletLoggedIn } from '@/lib/auth/utils'
import { cn } from '@/lib/utils/common/shadcn'
import { wagmiConfig } from '@/lib/wagmi/wagmi-config'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { GitHubIcon } from './github-icon'

// TODO: 钱包签名认证
// TODO: 全局状态管理存储钱包登录状态 ？
// TODO: 默认需要签名一次的，现在简单一点先直接连接钱包，要登录才需要签名
// TODO: 这里还有一个bug，github 登录后，钱包连接后，然后断开钱包，样式有点问题！
// TODO: 之后再说吧，累了，在改 bug 要猝死了🥲
export const LoginModal: FC<ComponentProps<'div'>> = () => {
  const { modalType, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'loginModal'
  const connectors = useConnectors().filter(v => v.id !== 'injected')
  const { mutate: connect, isPending } = useConnect()
  const router = useRouter()

  const connections = useConnections()
  const chainId = useChainId()
  const chains = useChains()

  const connection = connections[0]
  const isConnected = connections.length > 0
  // TODO: 这个就可以判断权限选择是否可以跳转到 /admin 了
  // TODO: 地址权限，样式不同
  // TODO: 钱包绑定 github
  const address = connection?.accounts[0]
  const currentChain = chains.find(c => c.id === chainId)

  const { data: session } = useSession()
  const isWalletUser = isWalletLoggedIn({ data: session })
  const isGithubUser = isEmailLoggedIn({ data: session })

  const [isSigningIn, setIsSigningIn] = useState(false)

  // TODO: 普通用户登录后也要签名一次，然后存储身份信息，给予权限
  // * 现在仅使用钱包来登录后端
  const isAdmin =
    ADMIN_WALLET_ADDRESS !== undefined &&
    address !== undefined &&
    address.toLowerCase() === ADMIN_WALLET_ADDRESS

  const handleSignIn = async () => {
    // TODO: toast，才发觉原生的 toast 样式已经不太干净了，样式需要重写一下再添加 toast
    if (address === undefined) {
      return
    }

    // TODO: 当前会签名验证成功，然后跳转再验证，应该签名一步就失败
    if (!isAdmin) {
      return
    }

    setIsSigningIn(true)

    try {
      const { data: nonceData, error: nonceError } = await authClient.siwe.nonce({
        walletAddress: address,
        chainId,
      })

      if (nonceError !== null || nonceData === null) {
        setIsSigningIn(false)
        return
      }

      const siweMessage = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the useyeyu.cc',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: nonceData.nonce,
      })

      const message = siweMessage.prepareMessage()
      const signature = await signMessage(wagmiConfig, { message })

      const { data: verifyData, error: verifyError } = await authClient.siwe.verify({
        message,
        signature,
        walletAddress: address,
        chainId,
      })

      if (verifyError !== null || verifyData === null) {
        setIsSigningIn(false)
        return
      }

      onModalClose()
      router.push('/admin')
    } catch {
      //
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="bg-clear-sky-background/80 rounded-xl backdrop-blur-xl sm:max-w-96 dark:bg-black/70">
        <DialogHeader className="">
          <DialogTitle className="text-center text-xl font-bold">
            {isConnected || isGithubUser || isWalletUser ? '用户信息' : '登录 (ゝ∀･)'}
          </DialogTitle>
        </DialogHeader>

        <main
          className={cn(
            'grid gap-4 font-mono',
            !isConnected && !isGithubUser && !isWalletUser && connectors.length > 0
              ? 'grid-cols-2'
              : 'grid-cols-1',
          )}
        >
          {isGithubUser ? (
            <div className="flex flex-col items-center justify-center gap-6 py-2">
              <div className="flex flex-col items-center gap-2">
                {session?.user?.image != null ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? 'User Avatar'}
                    width={64}
                    height={64}
                    className="rounded-full shadow-sm"
                  />
                ) : null}
                <div className="space-y-1 text-center text-wrap">
                  <p className="text-lg font-medium">{session?.user?.name}</p>
                  <p className="text-muted-foreground text-sm">{session?.user?.email}</p>
                </div>
              </div>

              <Button
                variant="destructive"
                onClick={async () => await signOut()}
                className="mt-2 w-full"
              >
                退出登录
              </Button>
            </div>
          ) : isWalletUser ? (
            <div className="flex flex-col items-center justify-center gap-6 py-2">
              <div className="space-y-1 text-center">
                <p className="text-muted-foreground text-xs">钱包地址</p>
                <p className="text-sm font-medium break-all">{session?.user?.name}</p>
              </div>

              <Button
                variant="destructive"
                onClick={async () => await signOut()}
                className="mt-2 w-full"
              >
                退出登录
              </Button>
            </div>
          ) : isConnected ? (
            <div className="flex flex-col items-center justify-center gap-6 py-2">
              <div className="space-y-1 text-center">
                <p className="text-muted-foreground text-xs">当前网络</p>
                <p className="">{currentChain?.name ?? 'Unknown Chain'}</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-muted-foreground text-xs">钱包地址</p>
                <p className="text-sm font-medium break-all">{address}</p>
              </div>

              <div className="flex w-full flex-col gap-2">
                {isAdmin && (
                  <Button onClick={handleSignIn} disabled={isSigningIn} className="w-full">
                    {isSigningIn ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        少女折寿中...
                      </>
                    ) : (
                      '签名登录'
                    )}
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={async () => await disconnect(wagmiConfig)}
                  className="w-full"
                >
                  断开连接
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Button
                type="button"
                onClick={() => signIn.social({ provider: 'github', callbackURL: '/admin' })}
                className={cn(
                  'flex cursor-pointer items-center text-base',
                  connectors.length > 0 ? 'justify-baseline' : 'justify-center',
                )}
                disabled={isPending}
              >
                <GitHubIcon className="size-5" />
                GitHub
              </Button>

              {connectors.map(connector => (
                <Button
                  key={connector.uid}
                  type="button"
                  className="flex cursor-pointer items-center justify-baseline px-3 text-base"
                  onClick={() => connect({ connector })}
                  disabled={isPending}
                >
                  {typeof connector.icon === 'string' ? (
                    <Image
                      src={connector?.icon}
                      alt={connector?.name}
                      className="size-5"
                      width={20}
                      height={20}
                    />
                  ) : (
                    <Wallet2 className="size-5" />
                  )}
                  {connector.name}
                </Button>
              ))}
            </>
          )}
        </main>
      </DialogContent>
    </Dialog>
  )
}
