import type { CommentTargetType } from '@/lib/api/comment/type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'
import { adminPendingCountQueryKey } from '@/hooks/api/admin/use-admin-pending-count-query'
import { deleteOwnComment } from '@/lib/api/comment/delete-own-comment'

export function useCommentDeleteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { id: number; targetType: CommentTargetType; targetId: number }) =>
      deleteOwnComment({
        id: params.id,
      }),
    onSuccess: async (_data, variables) => {
      sileo.success({ title: '评论已删除' })
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['public-comment-list', variables.targetType, variables.targetId],
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
