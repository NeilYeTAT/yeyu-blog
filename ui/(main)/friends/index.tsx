import type { Friend } from './types'
import { prisma } from '@/prisma/instance'
import { FriendApplyButton } from './friend-apply-button'
import { FriendsList } from './friends-list'

export async function FriendsPage() {
  const friends = await prisma.$queryRaw<Friend[]>`
    SELECT "id", "name", "description", "avatarUrl", "siteUrl"
    FROM "FriendLink"
    WHERE "state" = 'APPROVED'
    ORDER BY RANDOM()
  `

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col px-1 py-4 sm:px-4">
      <div className="mb-6 flex justify-center">
        <FriendApplyButton />
      </div>

      {friends.length > 0 ? (
        <FriendsList friends={friends} />
      ) : (
        <p className="m-auto py-24 text-zinc-600 dark:text-zinc-400">虚无。</p>
      )}
    </section>
  )
}
