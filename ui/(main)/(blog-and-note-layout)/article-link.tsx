import type { FC } from 'react'
import type { BlogListItem } from '@/lib/api/blog/type'
import type { NoteListItem } from '@/lib/api/note/type'
import { TagType } from '@prisma/client'
import Link from 'next/link'
import { cn } from '@/lib/utils/common/shadcn'
import { toDisplayDate } from '@/lib/utils/common/time'
import { ScaleUnderline } from './scale-underline'

export const ArticleLink: FC<{
  item: BlogListItem | NoteListItem
  type: TagType
}> = ({ item, type }) => {
  const isBlog = type === TagType.BLOG
  const isNote = type === TagType.NOTE

  return (
    <Link
      href={isBlog ? `/blog/${item?.slug}` : isNote ? `/note/${item?.slug}` : '/'}
      className={cn(
        'group flex cursor-pointer items-center justify-between gap-10 rounded-sm p-2 duration-500',
        'hover:text-theme-indicator dark:hover:text-white',
      )}
    >
      <h2 className="group relative truncate">
        {item.title}
        <ScaleUnderline />
      </h2>
      <time className="shrink-0 text-sm text-zinc-400 group-hover:text-theme-indicator dark:group-hover:text-white">
        {toDisplayDate(Date.parse(String(item.createdAt)))}
      </time>
    </Link>
  )
}
