import type { ComponentProps, FC } from 'react'
import { notFound } from 'next/navigation'
import { getPublishedNoteHTMLBySlug } from '@/actions/notes'
import { prisma } from '@/db'
import ArticleDisplayPage from '@/ui/components/shared/article-display-page'
import CommentCard from '@/ui/components/shared/comment-card'
import HorizontalDividingLine from '@/ui/components/shared/horizontal-dividing-line'
import ScrollIndicator from '@/ui/components/shared/scroll-indicator'

export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getPublishedNoteHTMLBySlug((await params).slug)

  if (article == null) notFound()

  return {
    title: article.title,
  }
}

export async function generateStaticParams() {
  const allArticles = await prisma.note.findMany({
    where: {
      isPublished: true,
    },
  })

  return allArticles.map(article => ({
    slug: article.slug,
  }))
}

export const NoteDetail: FC<ComponentProps<'div'> & { slug: string }> = async ({ slug }) => {
  const article = await getPublishedNoteHTMLBySlug(slug)
  if (article == null) notFound()

  const { content, title, createdAt, tags, id } = article
  const tagNames = tags.map(v => v.tagName)

  return (
    <div className="flex flex-col gap-4">
      <ArticleDisplayPage title={title} createdAt={createdAt} content={content} tags={tagNames} />
      <HorizontalDividingLine fill="#EC7FA9" />
      <CommentCard term={`${title}-note-${id}`} />
      <ScrollIndicator />
    </div>
  )
}
