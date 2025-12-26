import { redirect } from 'next/navigation'
import { getRawNoteBySlug } from '@/actions/notes'
import { getNoteTags } from '@/actions/tags'
import { requireAdmin } from '@/lib/auth'
import AdminArticleEditPage from '@/ui/components/shared/admin-article-edit-page'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] | undefined }>
}) {
  try {
    await requireAdmin()
  } catch {
    redirect(`/admin/note`)
  }

  const slug = (await params).slug?.[0] ?? null

  const [article, noteTags] = await Promise.all([
    slug != null ? getRawNoteBySlug(slug) : Promise.resolve(null),
    getNoteTags(),
  ])

  const relatedArticleTagNames = article != null ? article.tags.map(v => v.tagName) : []

  return (
    <AdminArticleEditPage
      article={article}
      relatedArticleTagNames={relatedArticleTagNames}
      allTags={noteTags}
    />
  )
}
