import type { ComponentProps, FC } from 'react'
import { siReact } from 'simple-icons/icons'

export const ReactIcon: FC<ComponentProps<'svg'>> = props => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={`#${siReact.hex}`}
      {...props}
    >
      <path d={siReact.path} />
    </svg>
  )
}
