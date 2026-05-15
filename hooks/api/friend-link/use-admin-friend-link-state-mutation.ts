import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminPendingCountQueryKey } from '@/hooks/api/admin'
import { updateFriendLink } from '@/lib/api/friend-link'

export function useAdminFriendLinkStateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateFriendLink,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['admin-friend-link-list'],
        }),
        queryClient.invalidateQueries({
          queryKey: adminPendingCountQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: ['public-friend-link-list'],
        }),
      ])
    },
  })
}
