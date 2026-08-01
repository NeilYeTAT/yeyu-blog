'use client'

import type { ComponentProps, FC } from 'react'
import type { Address } from 'viem'
import { GradientAvatar } from '@outpacelabs/avatars'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils/common/shadcn'

export const AccountIcon: FC<
  ComponentProps<'div'> & {
    account?: Address
  }
> = ({ className, account, ...props }) => {
  return (
    <div
      className={cn(
        'inline-flex size-5 items-center justify-center overflow-hidden rounded-full bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
        className,
      )}
      {...props}
    >
      {account != null ? (
        <GradientAvatar
          seed={account}
          size={32}
          radius="inherit"
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <User className="size-[62%]" />
      )}
    </div>
  )
}
