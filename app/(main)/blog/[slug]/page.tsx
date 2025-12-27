import { BlogDetail } from '@/ui/(main)/blog/[slug]'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug

  return <BlogDetail slug={slug} />
}
