import type { Metadata } from 'next'
import NoteListPage from '@/ui/(main)/(blog-and-note-layout)/note'

export const metadata: Metadata = {
  title: '笔记',
  description: '笔记',
}

export default function Page() {
  return <NoteListPage />
}
