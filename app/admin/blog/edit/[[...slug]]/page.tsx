import { getRawBlogBySlug } from '@/actions/blogs'
import AdminArticleEditPage from '@/components/shared/admin-article-edit-page'
import { requireAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] | undefined }>
}) {
  try {
    await requireAdmin()
  }
  catch {
    redirect(`/admin/blog`)
  }

  const slug = (await params).slug?.[0] ?? null
  const article = slug ? await getRawBlogBySlug(slug) : await Promise.resolve(null)

  const relatedBlogTagNames = article ? article.tags.map(v => v.tagName) : []

  return (
    <AdminArticleEditPage
      article={article}
      relatedArticleTagNames={relatedBlogTagNames}
    />
  )
}
