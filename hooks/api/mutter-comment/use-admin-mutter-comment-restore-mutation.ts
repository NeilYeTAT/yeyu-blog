import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminPendingCountQueryKey } from '@/hooks/api/admin'
import { restoreMutterComment } from '@/lib/api/mutter-comment'

export function useAdminMutterCommentRestoreMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { id: number }) =>
      restoreMutterComment({
        id: params.id,
        isDeleted: false,
      }),
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
