import { TagType } from '@prisma/client'
import { getAllShowNotes } from '@/actions/notes'
import { ArticleList } from '../article-list'

export default async function NoteListPage() {
  const allNotes = await getAllShowNotes()

  return <ArticleList items={allNotes} type={TagType.NOTE} />
}
