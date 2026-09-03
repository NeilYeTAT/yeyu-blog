import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'
import { createComment } from '@/lib/api/comment/create-comment'

export function useCommentMutation({ targetId }: { targetId: number }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { parentId?: number; content: string }) =>
      createComment({
        ...params,
        targetId,
      }),
    onSuccess: async data => {
      sileo.success({
        title: data.data.state === 'APPROVED' ? '评论已发布' : '评论已提交，等待审核',
      })
      await queryClient.invalidateQueries({
        queryKey: ['public-comment-list', targetId],
      })
      await queryClient.invalidateQueries({
        queryKey: ['admin-comment-list'],
      })
    },
    onError: () => {
      sileo.error({ title: '评论提交失败' })
    },
  })
}
