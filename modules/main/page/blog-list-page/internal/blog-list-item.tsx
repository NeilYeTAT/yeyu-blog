import Link from 'next/link'
import { toZhDay } from '@/lib/time'
import ScaleUnderline from '@/ui/components/shared/scale-underline'

export default function BlogListItem({
  blogTitle,
  createdAt,
  slug,
}: {
  blogTitle: string
  createdAt: Date
  slug: string
}) {
  return (
    <Link
      href={`blog/${slug}`}
      className="group flex cursor-pointer items-center justify-between gap-10 rounded-sm p-2 duration-500 hover:text-purple-600 dark:hover:text-emerald-300"
    >
      <h2 className="group relative truncate">
        {blogTitle}
        <ScaleUnderline className="bg-purple-600 dark:bg-emerald-300" />
      </h2>
      <time className="shrink-0 text-sm font-light text-gray-400 group-hover:text-purple-600 dark:group-hover:text-emerald-300">
        {toZhDay(createdAt)}
      </time>
    </Link>
  )
}
