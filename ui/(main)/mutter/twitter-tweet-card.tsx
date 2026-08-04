'use client'

import Script from 'next/script'
import { useEffect, useRef } from 'react'
import { getCreateTweet } from './mutter-twitter-widget'

function renderTweet(id: string, rootElement: HTMLDivElement | null) {
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
}

export function TwitterTweetCard({ id }: { id: string }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    renderTweet(id, rootRef.current)
  }, [id])

  return (
    <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-xl border border-zinc-200 bg-white p-1.5 dark:border-zinc-800 dark:bg-zinc-950">
      <div ref={rootRef} className="[&_iframe]:!mx-auto min-h-[96px]" />
      <Script
        id="twitter-widgets-script"
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onReady={() => renderTweet(id, rootRef.current)}
      />
    </div>
  )
}
