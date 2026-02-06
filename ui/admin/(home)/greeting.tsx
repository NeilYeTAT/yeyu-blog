'use client'

import type { ComponentProps, FC } from 'react'
import { sayHi } from '@/lib/time'

export const Greeting: FC<ComponentProps<'span'>> = () => {
  return <span className="text-pink-500">{sayHi()}</span>
}
