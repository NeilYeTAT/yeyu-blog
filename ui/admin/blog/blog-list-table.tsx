'use client'

import { motion } from 'motion/react'
import type { BlogListItem } from '@/actions/blogs/type'
import { columns } from './blog-table-column'
import { DataTable } from './data-table'

export default function BlogListTable({ blogList }: { blogList: BlogListItem[] }) {
  return (
    <motion.main
      className="h-full"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
      }}
    >
      <DataTable columns={columns} data={blogList} />
    </motion.main>
  )
}
