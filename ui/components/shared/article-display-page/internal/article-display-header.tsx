import { toDisplayDate } from '@/lib/time'
import TagItemBadge from '@/ui/components/shared/tag-item-badge'

export default function ArticleDisplayHeader({
  title,
  createdAt,
  tags,
}: {
  title: string
  createdAt: Date
  tags: string[]
}) {
  return (
    <header className="flex flex-col items-center justify-center gap-1">
      {/* TODO: extract */}
      <h1 className="text-3xl font-extrabold text-[#e64553] md:text-4xl dark:text-[#ff757f]">
        {title}
      </h1>

      <section className="flex w-full justify-center gap-2 text-xs md:text-sm">
        <p className="flex justify-center gap-2">
          {tags.map(tag => (
            <TagItemBadge key={`${tag.toString()}`} tag={tag} />
          ))}
        </p>

        <time className="border-b-foreground border-b border-dashed">
          {toDisplayDate(createdAt)}
        </time>
      </section>
    </header>
  )
}
