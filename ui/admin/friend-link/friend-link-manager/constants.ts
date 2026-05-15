import type { ComponentProps } from 'react'
import type { FriendLinkState } from '@/lib/api/friend-link'
import type { Badge } from '@/ui/shadcn/badge'
import type { FriendLinkEditForm, FriendLinkStateFilter } from './types'

export const friendLinkStateOptions: Array<{
  label: string
  value: FriendLinkStateFilter
}> = [
  { label: '全部状态', value: 'all' },
  { label: '待审核', value: 'PENDING' },
  { label: '已通过', value: 'APPROVED' },
  { label: '已拒绝', value: 'REJECTED' },
]

export const friendLinkStateLabelMap: Record<FriendLinkState, string> = {
  PENDING: '待审核',
  APPROVED: '已通过',
  REJECTED: '已拒绝',
}

export const friendLinkStateBadgeVariantMap: Record<
  FriendLinkState,
  NonNullable<ComponentProps<typeof Badge>['variant']>
> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
}

export const initialFriendLinkEditForm: FriendLinkEditForm = {
  name: '',
  email: '',
  description: '',
  avatarUrl: '',
  siteUrl: '',
}

export const friendLinkEditFields = [
  {
    name: 'name',
    label: '站点名称',
    type: 'text',
  },
  {
    name: 'email',
    label: '联系邮箱',
    type: 'email',
  },
  {
    name: 'description',
    label: '站点描述',
    type: 'text',
  },
  {
    name: 'avatarUrl',
    label: '头像地址',
    type: 'url',
  },
  {
    name: 'siteUrl',
    label: '站点地址',
    type: 'url',
  },
] satisfies {
  name: keyof FriendLinkEditForm
  label: string
  type: ComponentProps<'input'>['type']
}[]
