import { prisma } from '@/prisma/instance'
import { FriendApplyButton } from './friend-apply-button'
import { FriendsList } from './friends-list'

export async function FriendsPage() {
  const friends = await prisma.friendLink.findMany({
    where: {
      state: 'APPROVED',
    },
    select: {
      id: true,
      name: true,
      description: true,
      avatarUrl: true,
      siteUrl: true,
    },
  })

  for (let index = friends.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const currentFriend = friends[index]

    friends[index] = friends[randomIndex]
    friends[randomIndex] = currentFriend
  }

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col px-1 py-4 sm:px-4">
      <div className="mb-6 flex justify-center">
        <FriendApplyButton />
      </div>

      {friends.length > 0 ? (
        <FriendsList friends={friends} />
      ) : (
        <p className="m-auto py-24 text-theme-muted-foreground dark:text-theme-dark-muted-foreground">
          虚无。
        </p>
      )}
    </section>
  )
}
