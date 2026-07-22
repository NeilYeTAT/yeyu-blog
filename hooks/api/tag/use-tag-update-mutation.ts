import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTag } from '@/lib/api/tag/update-tag'

export function useTagUpdateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTag,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['tags'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['blog-tags'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['note-tags'],
        }),
      ])
    },
  })
}
