'use client'

import { useMemo } from 'react'
import { GenericLinkCard } from './generic-link-card'
import { getMutterContentBlocks } from './mutter-content-utils'
import { NeteaseMusicCard } from './netease-music-card'
import { TwitterTweetCard } from './twitter-tweet-card'

export function MutterContent({ content }: { content: string }) {
  const blocks = useMemo(() => getMutterContentBlocks(content), [content])

  return (
    <div className="flex flex-col gap-3">
      {blocks.map(block => {
        if (block.kind === 'text') {
          return (
            <p key={`text-${block.value}`} className="wrap-break-word whitespace-pre-wrap">
              {block.value}
            </p>
          )
        }

        if (block.kind === 'twitter') {
          return <TwitterTweetCard key={`twitter-${block.id}`} id={block.id} />
        }

        if (block.kind === 'neteaseMusic') {
          return (
            <NeteaseMusicCard key={`netease-music-${block.id}`} href={block.href} id={block.id} />
          )
        }

        return (
          <GenericLinkCard
            key={`link-${block.href}`}
            faviconUrl={block.faviconUrl}
            href={block.href}
            hostname={block.hostname}
            label={block.label}
          />
        )
      })}
    </div>
  )
}
