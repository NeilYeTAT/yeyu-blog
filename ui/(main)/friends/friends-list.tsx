'use client'

import type { Friend } from './types'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/ui/components/provider/main/language-provider'
import { FriendCard } from './friend-card'

const revealInterval = 100

export function FriendsList({ friends }: { friends: Friend[] }) {
  const { isLanguageChanging } = useLanguage()
  const [visibleFriendIds, setVisibleFriendIds] = useState<number[]>(() =>
    isLanguageChanging ? friends.map(friend => friend.id) : [],
  )
  const queuedFriendIdsRef = useRef<Set<number> | null>(null)
  const pendingFriendsRef = useRef<{ id: number; index: number }[]>([])
  const revealTimerRef = useRef<number | null>(null)

  if (queuedFriendIdsRef.current === null) {
    queuedFriendIdsRef.current = new Set()
  }

  const queuedFriendIds = queuedFriendIdsRef.current
  const visibleFriendIdSet = new Set(visibleFriendIds)

  function revealNextFriend() {
    pendingFriendsRef.current.sort((a, b) => a.index - b.index)
    const nextFriend = pendingFriendsRef.current.shift()

    if (nextFriend == null) {
      revealTimerRef.current = null
      return
    }

    setVisibleFriendIds(currentIds => [...currentIds, nextFriend.id])
    revealTimerRef.current = window.setTimeout(revealNextFriend, revealInterval)
  }

  const queueFriendReveal = (friend: Friend, index: number) => {
    if (queuedFriendIds.has(friend.id)) {
      return
    }

    queuedFriendIds.add(friend.id)
    pendingFriendsRef.current.push({ id: friend.id, index })

    if (revealTimerRef.current == null) {
      revealTimerRef.current = window.setTimeout(revealNextFriend, 0)
    }
  }

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
          shouldAnimate={!isLanguageChanging}
          onViewportEnter={() => {
            if (isLanguageChanging) {
              return
            }

            queueFriendReveal(friend, index)
          }}
        />
      ))}
    </ol>
  )
}
