import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'
import { adminPendingCountQueryKey } from '@/hooks/api/admin/use-admin-pending-count-query'
import { deleteOwnComment } from '@/lib/api/comment/delete-own-comment'

export function useCommentDeleteMutation({ targetId }: { targetId: number }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { id: number }) => deleteOwnComment(params),
    onSuccess: async () => {
      sileo.success({ title: '评论已删除' })
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['public-comment-list', targetId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['admin-comment-list'],
        }),
        queryClient.invalidateQueries({
          queryKey: adminPendingCountQueryKey,
        }),
      ])
    },
    onError: () => {
      sileo.error({ title: '评论删除失败' })
    },
  })
}
