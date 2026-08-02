'use client'

import type { Friend } from './types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FriendCard } from './friend-card'

const revealInterval = 100

export function FriendsList({ friends }: { friends: Friend[] }) {
  const [visibleFriendIds, setVisibleFriendIds] = useState<number[]>([])
  const queuedFriendIdsRef = useRef(new Set<number>())
  const pendingFriendsRef = useRef<{ id: number; index: number }[]>([])
  const revealTimerRef = useRef<number | null>(null)

  const revealNextFriend = useCallback(() => {
    pendingFriendsRef.current.sort((a, b) => a.index - b.index)
    const nextFriend = pendingFriendsRef.current.shift()

    if (nextFriend == null) {
      revealTimerRef.current = null
      return
    }

    setVisibleFriendIds(currentIds => [...currentIds, nextFriend.id])
    revealTimerRef.current = window.setTimeout(revealNextFriend, revealInterval)
  }, [])

  const queueFriendReveal = useCallback(
    (friend: Friend, index: number) => {
      if (queuedFriendIdsRef.current.has(friend.id)) {
        return
      }

      queuedFriendIdsRef.current.add(friend.id)
      pendingFriendsRef.current.push({ id: friend.id, index })

      if (revealTimerRef.current == null) {
        revealTimerRef.current = window.setTimeout(revealNextFriend, 0)
      }
    },
    [revealNextFriend],
  )

  useEffect(
    () => () => {
      if (revealTimerRef.current != null) {
        window.clearTimeout(revealTimerRef.current)
      }
    },
    [],
  )

  return (
    <ol className="flex flex-col gap-4 md:gap-6">
      {friends.map((friend, index) => (
        <FriendCard
          key={friend.id}
          friend={friend}
          index={index}
          isVisible={visibleFriendIds.includes(friend.id)}
          onViewportEnter={() => {
            queueFriendReveal(friend, index)
          }}
        />
      ))}
    </ol>
  )
}
