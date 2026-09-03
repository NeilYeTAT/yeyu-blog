'use client'

import type { ComponentType } from 'react'
import { useEffect, useRef, useState } from 'react'

export default function DeferredCommentCard({ articleId }: { articleId: number }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [LoadedCommentCard, setLoadedCommentCard] = useState<ComponentType<{
    articleId: number
  }> | null>(null)

  useEffect(() => {
    const root = rootRef.current

    if (root == null) return

    let isMounted = true
    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return

        observer.disconnect()
        void import('./deferred-comment-card-content').then(({ default: CommentCard }) => {
          if (!isMounted) return

          setLoadedCommentCard(() => CommentCard)
        })
      },
      { rootMargin: '800px 0px' },
    )

    observer.observe(root)

    return () => {
      isMounted = false
      observer.disconnect()
    }
  }, [])

  return (
    <div id="comments" ref={rootRef} className="mb-4 min-h-[16rem] scroll-mt-20">
      {LoadedCommentCard == null ? (
        <div aria-hidden="true" className="py-8 sm:py-10">
          <div className="h-8 w-28 animate-pulse rounded-lg bg-black/8 motion-reduce:animate-none dark:bg-white/10" />
          <div className="mt-6 space-y-3">
            <div className="h-3 w-full animate-pulse rounded-full bg-black/8 motion-reduce:animate-none dark:bg-white/10" />
            <div className="h-3 w-11/12 animate-pulse rounded-full bg-black/8 motion-reduce:animate-none dark:bg-white/10" />
            <div className="h-3 w-3/4 animate-pulse rounded-full bg-black/8 motion-reduce:animate-none dark:bg-white/10" />
          </div>
        </div>
      ) : (
        <LoadedCommentCard articleId={articleId} />
      )}
    </div>
  )
}
