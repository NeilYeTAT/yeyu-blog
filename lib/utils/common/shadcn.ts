import type { ClassValue } from 'class-variance-authority/types'
import type { DefaultClassGroupIds } from 'tailwind-merge'
import { cx } from 'class-variance-authority'
import { extendTailwindMerge } from 'tailwind-merge'

const tailwindMerge = extendTailwindMerge({
  extend: {
    conflictingClassGroups: {
      ['arbitrary..text-align' as DefaultClassGroupIds]: ['text-alignment'],
      'text-alignment': ['arbitrary..text-align' as DefaultClassGroupIds],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return tailwindMerge(cx(inputs))
}
