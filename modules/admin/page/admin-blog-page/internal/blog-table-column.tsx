'use client'

import {
  deleteBlogById,
  toggleBlogPublishedById,
  WithTagsBlog,
} from '@/actions/blogs'
import { Switch } from '@/components/ui/switch'
import { prettyDateTime } from '@/lib/time'
import TagItemBadge from '@/components/shared/tag-item-badge'
import { ColumnDef } from '@tanstack/react-table'
import { Button, buttonVariants } from '@/components/ui/button'
import { Edit2, Eye, Trash } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useModalStore } from '@/store/use-modal-store'
import { useBlogStore } from '@/store/use-blog-store'

export const columns: ColumnDef<WithTagsBlog>[] = [
  {
    accessorKey: 'title',
    header: '标题',
  },
  {
    accessorKey: 'tags',
    header: '标签',
    cell: ({ row }) => {
      const tags = row.original.tags

      return (
        <div className="flex gap-1">
          {tags.map((tag, i) => (
            <TagItemBadge
              tag={tag.tagName}
              key={`${tag.id}+${i}+${tag.toString()}`}
            />
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'isPublished',
    header: '是否发布',
    cell: ({ row }) => {
      const blog = row.original
      const blogId = row.original.id
      const { setBlogs, blogs } = useBlogStore()

      const handleToggle = async () => {
        const newStatus = !blog.isPublished

        const preBlogs = [...blogs]

        const updated = blogs.map(item =>
          item.id === blogId ? { ...item, isPublished: newStatus } : item,
        )
        setBlogs(updated)

        try {
          await toggleBlogPublishedById(blogId, newStatus)
        } catch (error) {
          // * 后序也整一个全局 Message 消息提醒出错~
          setBlogs(preBlogs)
          console.error('发布状态更新失败', error)
        }
      }

      return (
        <Switch
          onCheckedChange={handleToggle}
          checked={row.original.isPublished}
          key={`${row.original.id}-${row.original.slug}`}
        />
      )
    },
  },
  {
    // * 需要格式化一下时间, 并且需要排序
    accessorKey: 'createdAt',
    header: '创建时间',
    cell: ({ row }) => {
      const prettyTime = prettyDateTime(row.original.createdAt)
      return <span>{prettyTime}</span>
    },
  },
  {
    accessorKey: 'actions',
    header: '操作',
    cell: ({ row, table }) => {
      const slug = row.original.slug
      const blogId = row.original.id
      const { setBlogs } = useBlogStore()
      const { setModalOpen } = useModalStore()

      const handleDeleteBlogById = async () => {
        try {
          await deleteBlogById(blogId)

          const newTables = table.options.data.filter(
            blog => blog.id !== blogId,
          )
          // const newTables = await getAllBlogs()
          setBlogs(newTables)
        } catch (error) {
          console.error(`删除 ${row.original.title} 出错~`, error)
        }
      }

      return (
        <section className="flex items-center gap-1">
          <Link
            href={`/blog/${slug}`}
            className={cn(
              buttonVariants({ variant: 'outline', className: 'size-8' }),
            )}
          >
            <Eye className="size-4" />
          </Link>
          <Link
            href={`blog/edit/${slug}`}
            className={cn(
              buttonVariants({ variant: 'outline', className: 'size-8' }),
            )}
          >
            <Edit2 className="size-4" />
          </Link>
          <Button
            variant={'outline'}
            className="size-8"
            onClick={() => {
              setModalOpen('deleteArticleModal', handleDeleteBlogById)
            }}
          >
            <Trash />
          </Button>
        </section>
      )
    },
  },
]
