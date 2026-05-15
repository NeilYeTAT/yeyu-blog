import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminPendingCountQueryKey } from '@/hooks/api/admin'
import { updateComment } from '@/lib/api/comment'

export function useAdminCommentStateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateComment,
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
