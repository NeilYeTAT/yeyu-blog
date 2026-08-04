import type { ComponentProps, FC } from 'react'
import { cn } from '@/lib/utils/common/shadcn'

export const Emoticon: FC<ComponentProps<'span'>> = ({ children, className }) => {
  return <span className={cn('inline-block whitespace-nowrap', className)}>{children}</span>
}
