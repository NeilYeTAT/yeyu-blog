import type { ComponentProps } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/common/shadcn'

export const waveLinkTriggerClassName = 'group/wave-link'
export const waveLinkUnderlineClassName = `relative after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[5px] after:bg-current after:content-[''] after:[clip-path:inset(0_100%_0_0)] after:transition-[clip-path] after:duration-300 after:ease-out after:[mask-image:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='12'%20height='5'%20viewBox='0%200%2012%205'%3E%3Cpath%20d='M0%202.5C1.5%201.2%204.5%201.2%206%202.5s4.5%201.3%206%200'%20fill='none'%20stroke='black'%20stroke-width='1.25'/%3E%3C/svg%3E")] after:[mask-position:left_bottom] after:[mask-repeat:repeat-x] after:[mask-size:12px_5px] group-hover/wave-link:after:[clip-path:inset(0)] group-focus-visible/wave-link:after:[clip-path:inset(0)] motion-reduce:after:transition-none`

export function WaveLink({
  children,
  className,
  withWaveUnderline = true,
  ...props
}: ComponentProps<typeof Link> & { withWaveUnderline?: boolean }) {
  return (
    <Link className={cn(withWaveUnderline && waveLinkTriggerClassName, className)} {...props}>
      {withWaveUnderline ? (
        <span className={waveLinkUnderlineClassName}>{children}</span>
      ) : (
        children
      )}
    </Link>
  )
}
