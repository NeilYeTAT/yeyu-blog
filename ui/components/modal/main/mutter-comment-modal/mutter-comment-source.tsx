import Image from 'next/image'
import avatar from '@/config/img/avatar.webp'
import { prettyDateTime, toRelativeDate } from '@/lib/utils/time'

export function MutterCommentSource({
  values,
}: {
  values: {
    content: string
    createdAt: string
  } | null
}) {
  const createdAt = values?.createdAt != null ? Date.parse(values.createdAt) : null
  const hasValidCreatedAt = createdAt != null && !Number.isNaN(createdAt)

  return (
    <section className="flex items-start gap-3.5">
      <Image
        src={avatar}
        alt="my avatar"
        className="size-10 rounded-full border border-zinc-200 object-cover grayscale dark:border-zinc-700"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {values != null && hasValidCreatedAt ? (
          <time
            dateTime={values.createdAt}
            title={prettyDateTime(createdAt)}
            suppressHydrationWarning
            className="font-mono text-[11px] text-zinc-500 uppercase tracking-[0.12em] dark:text-zinc-400"
          >
            {toRelativeDate(createdAt)}
          </time>
        ) : null}
        <article className="rounded-xl border border-[#00000022] bg-theme-background/80 px-4 py-3 text-[15px] text-zinc-900 leading-7 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
          <p className="wrap-break-word whitespace-pre-wrap">{values?.content ?? ''}</p>
        </article>
      </div>
    </section>
  )
}
