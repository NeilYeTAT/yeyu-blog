import type { ComponentProps, FC } from 'react'
import { notFound } from 'next/navigation'
import { getPublishedNoteHTMLBySlug } from '@/actions/notes'
import ArticleDisplayPage from '@/ui/components/shared/article-display-page'
import CommentCard from '@/ui/components/shared/comment-card'
import HorizontalDividingLine from '@/ui/components/shared/horizontal-dividing-line'

export const NoteDetail: FC<ComponentProps<'div'> & { slug: string }> = async ({ slug }) => {
  const article = await getPublishedNoteHTMLBySlug(slug)
  if (article == null) notFound()

  const { content, title, createdAt, tags, id } = article
  const tagNames = tags.map(v => v.tagName)

  return (
    <div className="flex flex-col gap-4">
      <ArticleDisplayPage title={title} createdAt={createdAt} content={content} tags={tagNames} />
      <HorizontalDividingLine />
      <CommentCard term={`${title}-note-${id}`} />
    </div>
  )
}
