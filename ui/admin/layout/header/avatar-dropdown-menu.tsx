'use client'

import type * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import type { ComponentProps, FC } from 'react'
import type { Address } from 'viem'
import { LogOut } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { isWalletLoggedIn, signOut, useSession } from '@/lib/core'
import { AccountIcon } from '@/ui/components/shared/account-icon'
import YeYuAvatar from '@/ui/components/shared/yeyu-avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/shadcn/dropdown-menu'

export const AvatarDropdownMenu: FC<ComponentProps<typeof DropdownMenuPrimitive.Root>> = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const isWallet = isWalletLoggedIn({ data: session })
  const address = isWallet ? (session?.user?.name as Address) : undefined
  const formattedAddress =
    address != null ? `${address.slice(0, 4)}...${address.slice(-5)}` : undefined

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        {isWallet ? (
          <AccountIcon account={address} className="size-8 rounded-lg" />
        ) : session?.user.image != null ? (
          <Image
            src={session.user.image}
            alt="avatar"
            width={32}
            height={32}
            className="rounded-lg"
          />
        ) : (
          <AccountIcon account={undefined} />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-lg">
        <DropdownMenuLabel className="flex items-center gap-2 p-1">
          {isWallet ? (
            <AccountIcon account={address} className="size-8 rounded-lg" />
          ) : (
            <YeYuAvatar />
          )}
          <section>
            <h3 className="font-mono">
              {isWallet ? formattedAddress : session?.user?.name != null || 'example'}{' '}
            </h3>
            <small className="font-thin">
              {isWallet ? formattedAddress : session?.user?.email != null || 'example@gmail.com'}
            </small>
          </section>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            await signOut()
            router.push('/')
          }}
        >
          <LogOut />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
