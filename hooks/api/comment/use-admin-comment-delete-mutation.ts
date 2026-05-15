import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminPendingCountQueryKey } from '@/hooks/api/admin'
import { deleteComment } from '@/lib/api/comment'

export function useAdminCommentDeleteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['admin-comment-list'],
        }),
        queryClient.invalidateQueries({
          queryKey: adminPendingCountQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: ['public-comment-list'],
        }),
      ])
    },
  })
}
