'use client'

import { ColumnDef } from '@tanstack/react-table'
import { TagType, type BlogTag, type NoteTag } from '@prisma/client'
import TagItemBadge from '@/components/shared/tag-item-badge'
import { Badge } from '@/components/ui/badge'
import {
  Edit2,
  Trash,
  TypeIcon,
  Wrench,
  TagsIcon,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useModalStore } from '@/store/use-modal-store'
import {
  deleteBlogTagById,
  deleteNoteTagById,
  getBlogTagsAndNoteTags,
} from '@/actions/tags'
import { Tag, useTagStore } from '@/store/use-tag-store'
import { toast } from 'sonner'

// * 后序整一个分类排序
type WithCountBlogTagOrNoteTag =
  | (BlogTag & { count: number })
  | (NoteTag & { count: number })

export const columns: ColumnDef<WithCountBlogTagOrNoteTag>[] = [
  {
    accessorKey: 'tagName',
    header: () => {
      return (
        <span className="flex gap-1 items-center dark:text-gray-200 text-gray-500">
          <TypeIcon className="size-4" />
          标签名
        </span>
      )
    },
    cell: ({ row }) => {
      return <TagItemBadge tag={row.original.tagName} />
    },
  },
  {
    accessorKey: 'tagType',
    header: () => {
      return (
        <span className="flex gap-1 items-center dark:text-gray-200 text-gray-500">
          <TagsIcon className="size-4" />
          标签类型
        </span>
      )
    },
    cell: ({ row }) => {
      const tagType = row.original.tagType
      return <Badge className="font-mono">{tagType}</Badge>
    },
  },
  {
    accessorKey: 'count',
    header: ({ column }) => {
      return (
        <Button
          variant={'ghost'}
          size={'sm'}
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <FileText className="size-4" />
          关联文章数量
        </Button>
      )
    },
    cell: ({ row }) => {
      const relatedArticleCount = row.original.count
      return (
        <span className="font-mono ml-8 text-base">{relatedArticleCount}</span>
      )
    },
  },
  {
    accessorKey: 'actions',
    header: () => {
      return (
        <span className="flex gap-1 items-center dark:text-gray-200 text-gray-500">
          <Wrench className="size-4" />
          操作
        </span>
      )
    },
    cell: ({ row }) => {
      const { id, tagName, tagType } = row.original
      const { setTags } = useTagStore()

      return (
        <ActionButtons
          tagId={id}
          tagName={tagName}
          tagType={tagType}
          onUpdateTags={setTags}
        />
      )
    },
  },
]

function ActionButtons({
  tagId,
  tagName,
  tagType,
  onUpdateTags,
}: {
  tagId: number
  tagName: string
  tagType: TagType
  onUpdateTags: (tags: Tag[]) => void
}) {
  const { setModalOpen, onModalClose } = useModalStore()

  const handleDelete = async () => {
    try {
      if (tagType === TagType.BLOG && tagId) {
        await deleteBlogTagById(tagId)
      } else if (tagType === TagType.NOTE && tagId) {
        await deleteNoteTagById(tagId)
      } else {
        throw new Error('标签类型错误或 tagId 不存在!')
      }
    } catch (error) {
      toast.error(`删除 ${tagName} 出错~ ${error}`)
      console.error(`删除 ${tagName} 出错~`, error)
    }
    const allTags = await getBlogTagsAndNoteTags()
    onUpdateTags(allTags)
    onModalClose()
  }

  return (
    <section className="flex items-center gap-1">
      <Button
        variant={'outline'}
        className="size-8"
        onClick={() =>
          setModalOpen('editTagModal', {
            tagId,
            tagName,
            tagType,
          })
        }
      >
        <Edit2 className="size-4" />
      </Button>

      <Button
        variant={'outline'}
        className="size-8 text-red-600"
        onClick={() => {
          setModalOpen('deleteTagModal', handleDelete)
        }}
      >
        <Trash />
      </Button>
    </section>
  )
}
