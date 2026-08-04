'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import avatar from '@/config/img/avatar.webp'
import { useMutterLikeMutation } from '@/hooks/api/mutter/use-mutter-like-mutation'
import { getPublicMutters } from '@/lib/api/mutter/get-public-mutters'
import { cn } from '@/lib/utils/common/shadcn'
import { prettyDateTime } from '@/lib/utils/common/time'
import { useModalActions, useModalPayload, useModalType } from '@/store/use-modal-store'
import Loading from '@/ui/components/shared/loading'
import { itemVariants, listVariants } from './constant'
import { MutterCommentButton } from './mutter-comment-button'
import { MutterContent } from './mutter-content'
import { MutterLikeButton } from './mutter-like-button'

const pageSize = 10

export function MutterListClient({
  mutters: initialMutters,
  total,
}: {
  mutters: {
    id: number
    content: string
    likeCount: number
    createdAt: string
    commentCount: number
  }[]
  total: number
}) {
  const [likedMutterIds, setLikedMutterIds] = useState<number[]>([])
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>(() =>
    Object.fromEntries(initialMutters.map(item => [item.id, item.likeCount])),
  )
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const { mutateAsync: likeMutterById } = useMutterLikeMutation()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['public-mutter-list', pageSize],
    queryFn: ({ pageParam }) => getPublicMutters({ take: pageSize, skip: pageParam }),
    initialPageParam: 0,
    initialData: {
      pages: [
        {
          list: initialMutters,
          total,
          take: pageSize,
          skip: 0,
        },
      ],
      pageParams: [0],
    },
    getNextPageParam: lastPage => {
      const nextSkip = lastPage.skip + lastPage.list.length

      return nextSkip < lastPage.total ? nextSkip : undefined
    },
    staleTime: 1000 * 30,
  })
  const modalType = useModalType()
  const payload = useModalPayload()
  const { setModalOpen } = useModalActions()
  const shouldReduceMotion = useReducedMotion()
  const activeCommentPayload =
    modalType === 'mutterCommentModal' && payload != null
      ? (payload as {
          mutterId: number
          content: string
          createdAt: string
        })
      : null
  const mutters = (() => {
    const existingIds = new Set<number>()
    const nextMutters: typeof initialMutters = []

    for (const page of data.pages) {
      for (const item of page.list) {
        if (existingIds.has(item.id)) {
          continue
        }

        existingIds.add(item.id)
        nextMutters.push(item)
      }
    }

    return nextMutters
  })()
  const likedMutterIdSet = new Set(likedMutterIds)

  useEffect(() => {
    const element = loadMoreRef.current

    if (element == null || !hasNextPage) {
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]

        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      {
        rootMargin: '240px 0px',
      },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const handleLike = async (id: number) => {
    if (likedMutterIdSet.has(id)) {
      return
    }

    setLikedMutterIds(previousIds => [...previousIds, id])
    setLikeCounts(previousCounts => ({
      ...previousCounts,
      [id]: (previousCounts[id] ?? 0) + 1,
    }))

    const response = await likeMutterById({
      mutterId: id,
    })

    setLikeCounts(previousCounts => ({
      ...previousCounts,
      [id]: response.data.likeCount,
    }))
  }

  if (mutters.length === 0) {
    return (
      <section className="mx-auto mt-8 flex w-full max-w-3xl flex-1 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 py-12 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        虚无。
      </section>
    )
  }

  return (
    <motion.section
      className="mx-auto mt-6 flex w-[92%] max-w-3xl flex-col gap-3 pb-8 md:mt-8 md:w-full md:gap-4 md:pb-10"
      initial={shouldReduceMotion ? false : 'hidden'}
      animate="visible"
      variants={listVariants}
    >
      <motion.ul className="flex flex-col gap-3 md:gap-4" variants={listVariants}>
        {mutters.map((item, index) => {
          const createdAt = Date.parse(item.createdAt)
          const displayDateTime = prettyDateTime(createdAt)
          const isLiked = likedMutterIdSet.has(item.id)
          const likeCount = likeCounts[item.id] ?? item.likeCount
          const isCommentActive = activeCommentPayload?.mutterId === item.id
          const isRightAligned = index % 2 === 1

          return (
            <motion.li
              key={item.id}
              className={cn(
                'flex w-[calc(100%_-_2.625rem)] items-start gap-2.5 md:w-[72%] md:gap-3.5',
                isRightAligned && 'flex-row-reverse self-end',
              )}
              variants={itemVariants}
            >
              <Image
                src={avatar}
                alt="avatar"
                className="size-8 rounded-full border border-zinc-200 object-cover grayscale md:size-10 dark:border-zinc-700"
                priority={index === 0}
              />

              <div
                className={cn(
                  'flex min-w-0 flex-1 flex-col gap-1.5 md:gap-2',
                  isRightAligned && 'items-end',
                )}
              >
                <time
                  dateTime={item.createdAt}
                  title={displayDateTime}
                  suppressHydrationWarning
                  className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.12em] md:text-[11px] dark:text-zinc-400"
                >
                  {displayDateTime}
                </time>
                <article className="w-full rounded-xl border border-[#00000011] bg-theme-background/80 px-2.5 pt-1.5 pb-0.5 text-left text-sm text-zinc-900 leading-6 md:px-4 md:pt-3 md:pb-1 md:text-[15px] md:leading-7 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
                  <MutterContent content={item.content} />
                  <footer className="mt-1 flex items-center justify-end gap-0.5 md:mt-3">
                    <MutterCommentButton
                      isActive={isCommentActive}
                      commentCount={item.commentCount}
                      onClick={() => {
                        setModalOpen('mutterCommentModal', {
                          mutterId: item.id,
                          content: item.content,
                          createdAt: item.createdAt,
                        })
                      }}
                    />

                    <MutterLikeButton
                      isLiked={isLiked}
                      likeCount={likeCount}
                      onClick={() => {
                        void handleLike(item.id)
                      }}
                    />
                  </footer>
                </article>
              </div>
            </motion.li>
          )
        })}
      </motion.ul>
      {hasNextPage ? (
        <div ref={loadMoreRef} className="flex h-28 items-center justify-center">
          {isFetchingNextPage ? <Loading /> : null}
        </div>
      ) : null}
    </motion.section>
  )
}
