import { redirect } from 'next/navigation'
import { getRawBlogBySlug } from '@/actions/blogs'
import { getBlogTags } from '@/actions/tags'
import AdminArticleEditPage from '@/components/shared/admin-article-edit-page'
import { requireAdmin } from '@/lib/auth'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] | undefined }>
}) {
  try {
    await requireAdmin()
  } catch {
    redirect(`/admin/blog`)
  }

  const slug = (await params).slug?.[0] ?? null
  const [article, blogTags] = await Promise.all([
    slug != null ? getRawBlogBySlug(slug) : Promise.resolve(null),
    getBlogTags(),
  ])

  const relatedBlogTagNames = article != null ? article.tags.map(v => v.tagName) : []

  return (
    <AdminArticleEditPage
      article={article}
      relatedArticleTagNames={relatedBlogTagNames}
      allTags={blogTags}
    />
  )
}
