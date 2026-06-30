'use client'

import Script from 'next/script'
import { useCallback, useEffect, useRef } from 'react'
import { getCreateTweet } from './mutter-twitter-widget'

export function TwitterTweetCard({ id }: { id: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const renderTweet = useCallback(() => {
    const rootElement = rootRef.current
    const createTweet = getCreateTweet()

    if (rootElement == null || createTweet == null) {
      return
    }

    rootElement.replaceChildren()
    createTweet(id, rootElement, {
      align: 'center',
      cards: 'hidden',
      conversation: 'none',
      dnt: true,
      width: 300,
    })
  }, [id])

  useEffect(() => {
    renderTweet()
  }, [renderTweet])

  return (
    <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-xl border border-zinc-200 bg-white p-1.5 dark:border-zinc-800 dark:bg-zinc-950">
      <div ref={rootRef} className="[&_iframe]:!mx-auto min-h-[96px]" />
      <Script
        id="twitter-widgets-script"
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onReady={renderTweet}
      />
    </div>
  )
}
