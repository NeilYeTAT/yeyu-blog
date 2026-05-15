import type { AdminFriendLinkRecord, FriendLinkState } from '@/lib/api/friend-link'

export type FriendLinkStateFilter = 'all' | FriendLinkState

export type FriendLinkEditForm = Pick<
  AdminFriendLinkRecord,
  'name' | 'description' | 'avatarUrl' | 'siteUrl'
> & {
  email: string
}
