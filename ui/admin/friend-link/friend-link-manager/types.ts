import type { AdminFriendLinkRecord } from '@/lib/api/friend-link/get-admin-friend-links'
import type { FriendLinkState } from '@/lib/api/friend-link/type'

export type FriendLinkStateFilter = 'all' | FriendLinkState

export type FriendLinkEditForm = Pick<
  AdminFriendLinkRecord,
  'name' | 'description' | 'avatarUrl' | 'siteUrl'
> & {
  email: string
}
