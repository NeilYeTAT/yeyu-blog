import type { ComponentProps, FC } from 'react'
import { siNestjs } from 'simple-icons/icons'

export const NestjsIcon: FC<ComponentProps<'svg'>> = props => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={`#${siNestjs.hex}`}
      {...props}
    >
      <path d={siNestjs.path} />
    </svg>
  )
}
