import type { ComponentProps, FC } from 'react'
import { notFound } from 'next/navigation'
import { getPublishedBlogHTMLBySlug } from '@/actions/blogs'
import ArticleDisplayPage from '@/ui/components/shared/article-display-page'
import CommentCard from '@/ui/components/shared/comment-card'
import HorizontalDividingLine from '@/ui/components/shared/horizontal-dividing-line'
import ScrollIndicator from '@/ui/components/shared/scroll-indicator'

export const BlogDetail: FC<
  ComponentProps<'div'> & {
    slug: string
  }
> = async ({ slug }) => {
  const article = await getPublishedBlogHTMLBySlug(slug)

  if (article == null) notFound()

  const { content, title, createdAt, tags, id } = article

  const tagNames = tags.map(v => v.tagName)

  return (
    <div className="flex flex-col gap-4">
      <ArticleDisplayPage title={title} createdAt={createdAt} content={content} tags={tagNames} />
      <HorizontalDividingLine fill="#EC7FA9" />
      <CommentCard term={`${title}-blog-${id}`} />
      <ScrollIndicator />
    </div>
  )
}
