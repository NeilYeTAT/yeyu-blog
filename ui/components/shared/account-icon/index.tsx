'use client'

import type { ComponentProps, FC } from 'react'
import type { Address } from 'viem'
import { generateAvatarURL } from '@cfx-kit/wallet-avatar'
import Image from 'next/image'
import { cn } from '@/lib/utils/common/shadcn'

export const AccountIcon: FC<
  ComponentProps<'div'> & {
    account?: Address
  }
> = ({ className, account, ...props }) => {
  return (
    <div className={cn('inline-flex size-5 overflow-hidden rounded-full', className)} {...props}>
      {account != null && (
        <Image
          className="h-full w-full"
          width="32"
          height="32"
          src={generateAvatarURL(account)}
          alt=""
        />
      )}
    </div>
  )
}
