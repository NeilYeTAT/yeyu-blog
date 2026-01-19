import type { ComponentProps, FC } from 'react'
import { siVim } from 'simple-icons/icons'

export const VimIcon: FC<ComponentProps<'svg'>> = props => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={`#${siVim.hex}`}
      {...props}
    >
      <path d={siVim.path} />
    </svg>
  )
}
