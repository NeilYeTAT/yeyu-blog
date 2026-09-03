import type { PublicCommentRecord } from './get-public-comments'
import type { CommentState } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type CreateCommentParams = {
  targetId: number
  parentId?: number
  content: string
}

export type CreateCommentResponse = {
  message: string
  data: PublicCommentRecord & {
    state: CommentState
  }
}

export async function createComment(params: CreateCommentParams) {
  return await apiRequest<CreateCommentResponse>({
    url: 'comment',
    method: 'POST',
    json: {
      ...params,
      targetType: 'BLOG',
    },
  })
}
