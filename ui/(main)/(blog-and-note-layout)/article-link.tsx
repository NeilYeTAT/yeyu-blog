import type { FC } from 'react'
import { TagType } from '@prisma/client'
import Link from 'next/link'
import type { BlogListItem } from '@/actions/blogs/type'
import type { NoteListItem } from '@/actions/notes/type'
import { toZhDay } from '@/lib/time'
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
      className="group flex cursor-pointer items-center justify-between gap-10 rounded-sm p-2 duration-500 hover:text-purple-600 dark:hover:text-emerald-300"
    >
      <h2 className="group relative truncate">
        {item.title}
        <ScaleUnderline className="bg-purple-600 dark:bg-emerald-300" />
      </h2>
      <time className="shrink-0 text-sm font-light text-gray-400 group-hover:text-purple-600 dark:group-hover:text-emerald-300">
        {toZhDay(item.createdAt)}
      </time>
    </Link>
  )
}
