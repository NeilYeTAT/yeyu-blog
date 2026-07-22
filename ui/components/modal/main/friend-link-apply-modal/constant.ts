import type { ComponentProps } from 'react'
import type { CreateFriendLinkParams } from '@/lib/api/friend-link/create-friend-link'

export const friendLinkApplyFields = [
  {
    name: 'name',
    label: '站点名称',
    placeholder: `叶鱼 & 业余`,
    type: 'text',
  },
  {
    name: 'email',
    label: '联系邮箱（可选，仅用于通知）',
    placeholder: 'nearjilt@gmail.com',
    type: 'email',
    required: false,
  },
  {
    name: 'description',
    label: '站点描述',
    placeholder: '业余全栈开发',
    type: 'text',
  },
  {
    name: 'avatarUrl',
    label: '头像地址',
    placeholder: 'https://avatars.githubusercontent.com/u/140394258',
    type: 'url',
  },
  {
    name: 'siteUrl',
    label: '站点地址',
    placeholder: 'https://www.useyeyu.cc/',
    type: 'url',
  },
] satisfies {
  name: keyof CreateFriendLinkParams
  label: string
  placeholder?: string
  required?: boolean
  type?: ComponentProps<'input'>['type']
}[]

export const friendLinkSiteInfo = friendLinkApplyFields
  .reduce<string[]>((acc, field) => {
    acc.push(`${field.label}: ${field.placeholder}`)
    return acc
  }, [])
  .join('\n')
