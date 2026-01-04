import type { FC } from 'react'
import { TagType } from '@prisma/client'
import Link from 'next/link'
import type { BlogListItem } from '@/actions/blogs/type'
import type { NoteListItem } from '@/actions/notes/type'
import { toZhDay } from '@/lib/time'
import { cn } from '@/lib/utils/common/shadcn'
import ScaleUnderline from '@/ui/components/shared/scale-underline'

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
        'hover:text-clear-sky-indicator dark:hover:text-white',
      )}
    >
      <h2 className="group relative truncate">
        {item.title}
        <ScaleUnderline className="bg-clear-sky-indicator dark:bg-white" />
      </h2>
      <time className="group-hover:text-clear-sky-indicator shrink-0 text-sm font-light text-gray-400 dark:group-hover:text-white">
        {toZhDay(item.createdAt)}
      </time>
    </Link>
  )
}
