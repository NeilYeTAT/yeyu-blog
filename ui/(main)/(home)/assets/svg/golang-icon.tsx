import type { ComponentProps, FC } from 'react'
import { siGo } from 'simple-icons/icons'

export const GolangIcon: FC<ComponentProps<'svg'>> = props => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={`#${siGo.hex}`}
      {...props}
    >
      <path d={siGo.path} />
    </svg>
  )
}
