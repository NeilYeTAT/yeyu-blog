import type { ComponentProps, FC } from 'react'
import { siTailwindcss } from 'simple-icons/icons'

export const TailwindcssIcon: FC<ComponentProps<'svg'>> = props => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={`#${siTailwindcss.hex}`}
      {...props}
    >
      <path d={siTailwindcss.path} />
    </svg>
  )
}
