import { useQuery } from '@tanstack/react-query'
import { getCommentConfig } from '@/lib/api/comment/get-comment-config'

export function useCommentConfigQuery() {
  return useQuery({
    queryKey: ['comment-config'],
    queryFn: getCommentConfig,
    staleTime: 1000 * 30,
  })
}
