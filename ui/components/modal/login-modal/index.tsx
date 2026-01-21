'use client'

import type { ComponentProps, FC } from 'react'
import { Wallet2 } from 'lucide-react'
import Image from 'next/image'
import { useChainId, useChains, useConnect, useConnections, useConnectors } from 'wagmi'
import { disconnect } from 'wagmi/actions'
import { signIn } from '@/lib/auth/client'
import { cn } from '@/lib/utils/common/shadcn'
import { wagmiConfig } from '@/lib/wagmi/wagmi-config'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { GitHubIcon } from './github-icon'

// TODO: 钱包签名认证
// TODO: 全局状态管理存储钱包登录状态 ？
export const LoginModal: FC<ComponentProps<'div'>> = () => {
  const { modalType, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'loginModal'
  const connectors = useConnectors().filter(v => v.id !== 'injected')
  const { mutate: connect, isPending } = useConnect()

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

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="bg-clear-sky-background/80 rounded-xl backdrop-blur-xl sm:max-w-96 dark:bg-black/70">
        <DialogHeader className="">
          <DialogTitle className="text-center text-xl font-bold">
            {isConnected ? '钱包信息' : '登录 (ゝ∀･)'}
          </DialogTitle>
        </DialogHeader>

        <main
          className={cn(
            'grid gap-4 font-mono',
            !isConnected && connectors.length > 0 ? 'grid-cols-2' : 'grid-cols-1',
          )}
        >
          {isConnected ? (
            <div className="flex flex-col items-center justify-center gap-6 py-2">
              <div className="space-y-1 text-center">
                <p className="text-muted-foreground text-xs">当前网络</p>
                <p className="font-medium">{currentChain?.name ?? 'Unknown Chain'}</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-muted-foreground text-xs">钱包地址</p>
                <p className="text-sm font-medium break-all">{address}</p>
              </div>

              <Button
                variant="destructive"
                onClick={async () => await disconnect(wagmiConfig)}
                className="mt-2 w-full"
              >
                断开连接
              </Button>
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
