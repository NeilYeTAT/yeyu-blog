'use client'

import { ColumnDef } from '@tanstack/react-table'
import type { BlogTag, NoteTag } from '@prisma/client'
import TagItemBadge from '@/components/shared/tag-item-badge'
import { Badge } from '@/components/ui/badge'
import { Edit2, Trash, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useModalStore } from '@/store/use-modal-store'

// * 后序整一个分类排序
type WithCountBlogTagOrNoteTag =
  | (BlogTag & { count: number })
  | (NoteTag & { count: number })

export const columns: ColumnDef<WithCountBlogTagOrNoteTag>[] = [
  {
    accessorKey: 'tagName',
    header: '标签名',
    cell: ({ row }) => {
      return <TagItemBadge tag={row.original.tagName} />
    },
  },
  {
    accessorKey: 'tagType',
    header: '标签类型',
    cell: ({ row }) => {
      const tagType = row.original.tagType
      // * 后序整一个颜色
      return <Badge className="font-mono">{tagType}</Badge>
    },
  },
  {
    accessorKey: 'count',
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="cursor-pointer"
        >
          关联文章数量
        </div>
      )
    },
    cell: ({ row }) => {
      const relatedArticleCount = row.original.count
      return <div>{relatedArticleCount}</div>
    },
    meta: {
      className: 'text-center',
    },
  },
  {
    accessorKey: 'actions',
    header: '操作',
    cell: ({ row, table }) => {
      // * 后序再补一个 modal 框出来让点击确认
      const { setModalOpen } = useModalStore()

      return (
        <section className="flex items-center gap-1">
          <Button
            variant={'outline'}
            className="size-8"
            onClick={() =>
              setModalOpen('editTagModal', {
                tagId: row.original.id,
                tagName: row.original.tagName,
                tagType: row.original.tagType,
              })
            }
          >
            <Edit2 className="size-4" />
          </Button>

          <Button
            variant={'outline'}
            className="size-8 text-red-600"
            onClick={() => {
              setModalOpen('deleteTagModal', {
                tagId: row.original.id,
                tagType: row.original.tagType,
              })
            }}
          >
            <Trash />
          </Button>
        </section>
      )
    },
  },
]
