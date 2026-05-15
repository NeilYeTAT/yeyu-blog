import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminPendingCountQueryKey } from '@/hooks/api/admin'
import { updateMutterComment } from '@/lib/api/mutter-comment'

export function useAdminMutterCommentStateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMutterComment,
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
