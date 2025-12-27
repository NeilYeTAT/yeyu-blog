import type { ComponentProps, FC } from 'react'
import { cn } from '@/lib/utils/common/shadcn'

export const MaxWidthWrapper: FC<ComponentProps<'div'>> = ({ className, children }) => {
  return <div className={cn('mx-auto w-11/12 max-w-3xl', className)}>{children}</div>
}
