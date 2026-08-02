'use client'

import type { Friend } from './types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FriendCard } from './friend-card'

const revealInterval = 100

export function FriendsList({ friends }: { friends: Friend[] }) {
  const [visibleFriendIds, setVisibleFriendIds] = useState<number[]>([])
  const queuedFriendIdsRef = useRef<Set<number> | null>(null)
  const pendingFriendsRef = useRef<{ id: number; index: number }[]>([])
  const revealTimerRef = useRef<number | null>(null)

  if (queuedFriendIdsRef.current === null) {
    queuedFriendIdsRef.current = new Set()
  }

  const queuedFriendIds = queuedFriendIdsRef.current
  const visibleFriendIdSet = new Set(visibleFriendIds)

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
      if (queuedFriendIds.has(friend.id)) {
        return
      }

      queuedFriendIds.add(friend.id)
      pendingFriendsRef.current.push({ id: friend.id, index })

      if (revealTimerRef.current == null) {
        revealTimerRef.current = window.setTimeout(revealNextFriend, 0)
      }
    },
    [queuedFriendIds, revealNextFriend],
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
          isVisible={visibleFriendIdSet.has(friend.id)}
          onViewportEnter={() => {
            queueFriendReveal(friend, index)
          }}
        />
      ))}
    </ol>
  )
}
