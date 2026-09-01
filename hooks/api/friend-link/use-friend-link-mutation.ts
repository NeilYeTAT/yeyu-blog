import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'
import { createFriendLink } from '@/lib/api/friend-link/create-friend-link'
import { useTranslations } from '@/ui/components/provider/main/language-provider'

export function useFriendLinkMutation() {
  const queryClient = useQueryClient()
  const translations = useTranslations()

  return useMutation({
    mutationFn: createFriendLink,
    onSuccess: async () => {
      sileo.success({ title: translations.friendLinkApplyModal.submitted })
      await queryClient.invalidateQueries({
        queryKey: ['admin-friend-link-list'],
      })
    },
    onError: error => {
      sileo.error({ title: error.message })
    },
  })
}
