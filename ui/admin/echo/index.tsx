'use client'

import type { ComponentProps, FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getAllEchos, getQueryEchos } from '@/actions/echos'
import Loading from '@/ui/components/shared/loading'
import { DataTable } from '../components/table/data-table'
import EchoSearch from './echo-search'
import { columns } from './echo-table-column'

export const AdminEchoPage: FC<ComponentProps<'main'>> = () => {
  const [query, setQuery] = useState('')
  const { isPending, data } = useQuery({
    queryKey: ['echo-list', query],
    queryFn: () => (query.trim().length > 0 ? getQueryEchos(query) : getAllEchos()),
  })

  return (
    <main className="flex w-full flex-col gap-2">
      <EchoSearch setQuery={setQuery} />

      {isPending ? <Loading /> : <DataTable columns={columns} data={data ?? []} />}
    </main>
  )
}
