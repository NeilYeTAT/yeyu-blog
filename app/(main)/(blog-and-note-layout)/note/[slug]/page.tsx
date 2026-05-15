import type { Metadata } from 'next'
import { prisma } from '@/prisma/instance'
import { NoteDetail } from '@/ui/(main)/(blog-and-note-layout)/note/[slug]'

export async function generateStaticParams() {
  const notes = await prisma.note.findMany({
    where: { isPublished: true },
    select: { slug: true },
  })

  return notes.map(note => ({ slug: note.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const slug = (await params).slug
  const note = await prisma.note.findUnique({
    where: { slug },
    select: { title: true },
  })

  return {
    title: note?.title ?? '笔记',
    description: note?.title ?? '笔记',
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug

  return <NoteDetail slug={slug} />
}
