import type { ComponentProps, FC } from 'react'
import { notFound } from 'next/navigation'
import { processor } from '@/lib/core/markdown/processor'
import { prisma } from '@/prisma/instance'
import ArticleDisplayPage from '@/ui/(main)/(blog-and-note-layout)/article-display-page'
import CommentCard from '@/ui/(main)/(blog-and-note-layout)/comment-card'
import HorizontalDividingLine from '@/ui/components/shared/horizontal-dividing-line'

export const NoteDetail: FC<ComponentProps<'div'> & { slug: string }> = async ({ slug }) => {
  const note = await prisma.note.findUnique({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      tags: true,
    },
  })

  if (note == null || note.content.length === 0) notFound()

  const sanitizedNoteHtml = await processor.process(note.content)
  const article = {
    ...note,
    content: sanitizedNoteHtml.toString(),
  }

  const { content, createdAt, tags, id } = article
  const tagNames = tags.map(v => v.tagName)

  return (
    <div className="flex flex-col gap-4">
      <ArticleDisplayPage createdAt={createdAt} sanitizedContent={content} tags={tagNames} />
      <HorizontalDividingLine />
      <CommentCard articleType="NOTE" articleId={id} />
    </div>
  )
}
