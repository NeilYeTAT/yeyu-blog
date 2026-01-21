'use client'

import type { ComponentProps, FC } from 'react'
import { Wallet2 } from 'lucide-react'
import Image from 'next/image'
import { useConnect, useConnectors } from 'wagmi'
import { signIn } from '@/lib/auth/client'
import { cn } from '@/lib/utils/common/shadcn'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { GitHubIcon } from './github-icon'

// TODO: 钱包签名认证
export const LoginModal: FC<ComponentProps<'div'>> = () => {
  const { modalType, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'loginModal'
  const connectors = useConnectors().filter(v => v.id !== 'injected')
  const { mutate: connect, isPending } = useConnect()

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="bg-clear-sky-background/80 rounded-xl backdrop-blur-xl sm:max-w-96 dark:bg-black/70">
        <DialogHeader className="">
          <DialogTitle className="text-center text-xl font-bold">登录 (ゝ∀･)</DialogTitle>
        </DialogHeader>

        <main
          className={cn(
            'grid gap-4 font-mono',
            connectors.length > 0 ? 'grid-cols-2' : 'grid-cols-1',
          )}
        >
          <Button
            type="button"
            onClick={() => signIn.social({ provider: 'github', callbackURL: '/admin' })}
            className={cn(
              'flex cursor-pointer items-center text-base',
              connectors.length > 0 ? 'justify-baseline' : 'justify-center',
            )}
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
        </main>
      </DialogContent>
    </Dialog>
  )
}
