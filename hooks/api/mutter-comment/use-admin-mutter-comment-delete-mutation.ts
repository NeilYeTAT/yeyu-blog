import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminPendingCountQueryKey } from '@/hooks/api/admin/use-admin-pending-count-query'
import { deleteMutterComment } from '@/lib/api/mutter-comment/delete-mutter-comment'

export function useAdminMutterCommentDeleteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMutterComment,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['admin-mutter-comment-list'],
        }),
        queryClient.invalidateQueries({
          queryKey: adminPendingCountQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: ['public-mutter-comment-list'],
        }),
      ])
    },
  })
}
