import { useQuery } from '@tanstack/react-query'
import {
  type GetPublicCommentsParams,
  getPublicComments,
} from '@/lib/api/comment/get-public-comments'

export function usePublicCommentQuery(params: GetPublicCommentsParams) {
  const { targetId, take = 20, skip = 0 } = params

  return useQuery({
    queryKey: ['public-comment-list', targetId, take, skip],
    queryFn: () =>
      getPublicComments({
        targetId,
        take,
        skip,
      }),
    staleTime: 1000 * 30,
  })
}
