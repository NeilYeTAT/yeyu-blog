import type { ComponentProps } from 'react'
import type { CreateFriendLinkParams } from '@/lib/api/friend-link/create-friend-link'

export const friendLinkApplyFields = [
  {
    name: 'name',
    type: 'text',
    required: true,
  },
  {
    name: 'email',
    type: 'email',
    required: false,
  },
  {
    name: 'description',
    type: 'text',
    required: true,
  },
  {
    name: 'avatarUrl',
    type: 'url',
    required: true,
  },
  {
    name: 'siteUrl',
    type: 'url',
    required: true,
  },
] satisfies {
  name: keyof CreateFriendLinkParams
  required: boolean
  type: ComponentProps<'input'>['type']
}[]
