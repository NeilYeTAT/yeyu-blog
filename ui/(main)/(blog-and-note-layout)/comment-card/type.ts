import type { Address } from 'viem'
import type { PublicCommentRecord } from '@/lib/api/comment/get-public-comments'
import type { CommentParent } from '@/lib/api/comment/type'

export type CommentTreeNode = PublicCommentRecord & {
  children: CommentTreeNode[]
}

export type CommentAuthorLike = Pick<
  CommentParent,
  'authorName' | 'authorImage' | 'isAdmin' | 'user'
>

export type SessionAvatarProps = {
  isAdminUser: boolean
  isWalletUser: boolean
  sessionAvatar?: string
  sessionAddress?: Address
}
