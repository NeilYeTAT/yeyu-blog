import type { ComponentProps } from 'react'
import type { CommentState } from '@/lib/api/comment/type'
import type { Badge } from '@/ui/shadcn/badge'
import type { CommentStateFilter, CommentTargetTypeFilter } from './types'

export const commentStateOptions: Array<{
  label: string
  value: CommentStateFilter
}> = [
  { label: '全部状态', value: 'all' },
  { label: '待审核', value: 'PENDING' },
  { label: '已通过', value: 'APPROVED' },
  { label: '已拒绝', value: 'REJECTED' },
  { label: '已删除', value: 'deleted' },
]

export const commentStateLabelMap: Record<CommentState, string> = {
  PENDING: '待审核',
  APPROVED: '已通过',
  REJECTED: '已拒绝',
}

export const commentStateBadgeVariantMap: Record<
  CommentState,
  NonNullable<ComponentProps<typeof Badge>['variant']>
> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
}

export const targetTypeOptions: Array<{
  label: string
  value: CommentTargetTypeFilter
}> = [
  { label: '全部类型', value: 'all' },
  { label: '博客', value: 'BLOG' },
]

export const targetTypeLabelMap: Record<'BLOG', string> = {
  BLOG: '博客',
}
