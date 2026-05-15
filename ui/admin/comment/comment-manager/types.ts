import type { CommentState, CommentTargetType } from '@/lib/api/comment'

export type CommentStateFilter = 'all' | 'deleted' | CommentState

export type CommentTargetTypeFilter = 'all' | CommentTargetType
