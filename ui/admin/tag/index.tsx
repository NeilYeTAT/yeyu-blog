'use client'

import type { ComponentProps, FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getAllTags, getQueryTags } from '@/actions/tags'
import Loading from '@/ui/components/shared/loading'
import { DataTable } from '../components/table/data-table'
import TagSearch from './tag-search'
import { columns } from './tag-table-column'

export const AdminTagPage: FC<ComponentProps<'main'>> = () => {
  const [query, setQuery] = useState('')
  const { isPending, data } = useQuery({
    queryKey: ['tags', query],
    queryFn: () => (query.trim().length > 0 ? getQueryTags(query) : getAllTags()),
    staleTime: 1000 * 30,
  })

  return (
    <main className="flex w-full flex-col gap-2">
      <TagSearch setQuery={setQuery} />
      {isPending ? <Loading /> : <DataTable columns={columns} data={data ?? []} />}
    </main>
  )
}
