'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getNoteList, getNotesBySelectedTagName, getQueryNotes } from '@/actions/notes'
import { getNoteTags } from '@/actions/tags'
import Loading from '@/components/shared/loading'
import NoteListTable from './internal/note-list-table'
import NoteSearch from './internal/note-search'
import { NoteTagsContainer } from './internal/note-tags-container'

export default function AdminNotePage() {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const { data: noteList, isPending: noteListPending } = useQuery({
    queryKey: ['note-list', query, selectedTags],
    queryFn: () => {
      if (query.trim().length > 0) return getQueryNotes(query)
      if (selectedTags.length > 0) return getNotesBySelectedTagName(selectedTags)
      return getNoteList()
    },
    staleTime: 1000 * 30,
  })

  const { data: noteTags, isPending: noteTagsPending } = useQuery({
    queryKey: ['note-tags'],
    queryFn: getNoteTags,
  })

  return (
    <main className="flex w-full flex-col gap-2">
      <NoteSearch setQuery={setQuery} />

      {!noteTagsPending && (
        <NoteTagsContainer noteTagList={noteTags ?? []} setSelectedTags={setSelectedTags} />
      )}

      {noteListPending || noteTagsPending ? (
        <Loading />
      ) : (
        <NoteListTable noteList={noteList ?? []} />
      )}
    </main>
  )
}
