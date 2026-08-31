import type { FC } from 'react'
import './background.css'

export const Background: FC = () => {
  return (
    <div aria-hidden="true" className="site-background pointer-events-none fixed inset-0 -z-10" />
  )
}
