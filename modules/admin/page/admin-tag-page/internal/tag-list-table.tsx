'use client'

import { motion } from 'motion/react'
import type { Tag } from '@/actions/tags/type'
import Loading from '@/ui/components/shared/loading'
import { DataTable } from './data-table'
import { columns } from './tag-table-column'

export default function TagListTable({ data, isPending }: { data: Tag[]; isPending: boolean }) {
  return isPending ? (
    <Loading />
  ) : (
    <motion.main
      className="flex-1"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
      }}
    >
      <DataTable columns={columns} data={data ?? []} />
    </motion.main>
  )
}
