import { NoteDetail } from '@/ui/(main)/note/[slug]'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug

  return <NoteDetail slug={slug} />
}
