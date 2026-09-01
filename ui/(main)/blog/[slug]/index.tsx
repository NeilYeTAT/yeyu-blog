import { notFound } from 'next/navigation'
import { processor } from '@/lib/core/markdown/processor'
import { prisma } from '@/prisma/instance'
import ArticleDisplayPage from '@/ui/(main)/blog/article-display-page'
import DeferredCommentCard from '@/ui/(main)/blog/comment-card/deferred-comment-card'
import HorizontalDividingLine from '@/ui/components/shared/horizontal-dividing-line'
import { MainScrollBlur } from '@/ui/components/shared/main-scroll-blur'

export async function BlogDetail({ slug }: { slug: string }) {
  const blog = await prisma.blog.findUnique({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      tags: true,
    },
  })

  if (blog == null || blog.content.length === 0) notFound()

  const sanitizedBlogHtml = await processor.process(blog.content)
  const article = {
    ...blog,
    content: sanitizedBlogHtml.toString(),
  }

  const { content, createdAt, tags, id } = article

  const tagNames = tags.map(v => v.tagName)

  return (
    <div className="flex flex-col gap-4">
      <ArticleDisplayPage createdAt={createdAt} sanitizedContent={content} tags={tagNames} />
      <HorizontalDividingLine />
      <DeferredCommentCard articleId={id} />
      <MainScrollBlur />
    </div>
  )
}
