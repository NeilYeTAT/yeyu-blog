import type { CommentState, CommentTargetType } from '@/lib/api/comment/type'

export type CommentStateFilter = 'all' | 'deleted' | CommentState

export type CommentTargetTypeFilter = 'all' | CommentTargetType
