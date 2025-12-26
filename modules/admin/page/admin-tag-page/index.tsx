'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getAllTags, getQueryTags } from '@/actions/tags'
import TagListTable from './internal/tag-list-table'
import TagSearch from './internal/tag-search'

export default function AdminTagPage() {
  const [query, setQuery] = useState('')
  const { isPending, data } = useQuery({
    queryKey: ['tags', query],
    queryFn: () => (query.trim().length > 0 ? getQueryTags(query) : getAllTags()),
    staleTime: 1000 * 30,
  })

  return (
    <main className="flex w-full flex-col gap-2">
      <TagSearch setQuery={setQuery} />
      <TagListTable data={data ?? []} isPending={isPending} />
    </main>
  )
}
