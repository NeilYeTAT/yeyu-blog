'use client'

import type { ComponentType } from 'react'
import { useEffect, useRef, useState } from 'react'

function loadDeferredCommentCard() {
  return import('./deferred-comment-card-content').then(module => module.default)
}

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
        void loadDeferredCommentCard().then(CommentCard => {
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
    <div id="comments" ref={rootRef} className="mb-4 min-h-[13rem] scroll-mt-20">
      {LoadedCommentCard == null ? (
        <div aria-hidden="true" className="py-2 sm:py-4">
          <div className="h-7 w-24 animate-pulse rounded bg-foreground/10 motion-reduce:animate-none" />
          <div className="mt-5 h-28 animate-pulse rounded-lg bg-foreground/5 motion-reduce:animate-none" />
        </div>
      ) : (
        <LoadedCommentCard articleId={articleId} />
      )}
    </div>
  )
}
