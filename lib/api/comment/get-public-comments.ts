import type { CommentParent, CommentUser } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type PublicCommentRecord = {
  id: number
  parentId: number | null
  parent: CommentParent | null
  userId: string | null
  isAdmin: boolean
  authorName: string
  authorImage: string | null
  content: string
  sanitizedHtmlContent: string
  isDeleted: boolean
  createdAt: string
  user: CommentUser | null
}

export type GetPublicCommentsResponse = {
  list: PublicCommentRecord[]
  total: number
  take: number
  skip: number
}

export type GetPublicCommentsParams = {
  targetId: number
  take?: number
  skip?: number
}

export async function getPublicComments(params: GetPublicCommentsParams) {
  const { targetId, take = 20, skip = 0 } = params

  return await apiRequest<GetPublicCommentsResponse>({
    url: 'comment',
    method: 'GET',
    searchParams: {
      targetType: 'BLOG',
      targetId: String(targetId),
      take: String(take),
      skip: String(skip),
    },
  })
}
