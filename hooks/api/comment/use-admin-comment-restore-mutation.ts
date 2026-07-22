import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminPendingCountQueryKey } from '@/hooks/api/admin/use-admin-pending-count-query'
import { restoreComment } from '@/lib/api/comment/update-comment'

export function useAdminCommentRestoreMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { id: number }) =>
      restoreComment({
        id: params.id,
        isDeleted: false,
      }),
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
