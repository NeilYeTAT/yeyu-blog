import type { ComponentProps, FC } from 'react'
import { siNextdotjs } from 'simple-icons/icons'

export const NextjsIcon: FC<ComponentProps<'svg'>> = props => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={`#${siNextdotjs.hex}`}
      {...props}
    >
      <path d={siNextdotjs.path} />
    </svg>
  )
}
