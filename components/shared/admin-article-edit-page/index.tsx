'use client'

import type { ArticleDTO } from './type'
import type { Blog, BlogTag, Note, NoteTag } from '@prisma/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { TagType } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { File, Loader2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createBlog, updateBlogById } from '@/actions/blogs'
import { createNote, updateNoteById } from '@/actions/notes'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { parseEditPageTypeFromUrl } from '@/lib/url'
import { useModalStore } from '@/store/use-modal-store'
import MarkdownEditor from './internal/markdown-editor'
import { ArticleSchema } from './type'

export default function AdminArticleEditPage({
  article,
  relatedArticleTagNames,
  allTags,
}: {
  article: Blog | Note | null
  relatedArticleTagNames?: string[]
  allTags: BlogTag[] | NoteTag[]
}) {
  const router = useRouter()
  const { setModalOpen } = useModalStore()
  const pathname = usePathname()
  const editPageType = parseEditPageTypeFromUrl(pathname)

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: (values: ArticleDTO) => updateArticle(values, editPageType, article?.id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })

      switch (editPageType) {
        case TagType.BLOG:
          queryClient.invalidateQueries({ queryKey: ['blog-list'] })
          break
        case TagType.NOTE:
          queryClient.invalidateQueries({ queryKey: ['note-list'] })
          break
        default:
          throw new Error(`文章类型错误`)
      }

      toast.success('保存成功')
      router.push(`/admin/${editPageType.toLowerCase()}/edit/${variables.slug}`)
    },
    onError: error => {
      if (error instanceof Error) {
        toast.error(`保存失败 ${error.message}`)
      } else {
        toast.error(`保存失败`)
      }
    },
  })

  const form = useForm<ArticleDTO>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      title: article?.title ?? '',
      slug: article?.slug ?? '',
      isPublished: article?.isPublished ?? false,
      relatedTagNames: relatedArticleTagNames ?? [],
      content: article?.content ?? '',
    },
    mode: 'onBlur',
  })

  async function onSubmit(values: ArticleDTO) {
    mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8 pb-44">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">标题</FormLabel>
              <FormControl>
                <Input placeholder="请输入标题" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">slug</FormLabel>
              <FormControl>
                <Input placeholder="请输入 slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">是否发布</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={checked => {
                    field.onChange(checked)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-end gap-2">
          <FormField
            control={form.control}
            name="relatedTagNames"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel className="text-lg">标签</FormLabel>
                <FormControl>
                  <Combobox
                    options={
                      allTags.map(el => ({
                        label: el.tagName,
                        value: el.tagName,
                      })) ?? []
                    }
                    multiple
                    clearable
                    selectPlaceholder="请选择标签"
                    value={field.value}
                    onValueChange={val =>
                      form.setValue('relatedTagNames', val, {
                        shouldValidate: true,
                      })
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="default"
            onClick={() => setModalOpen('createTagModal')}
            className="cursor-pointer"
          >
            新建标签
          </Button>
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">内容</FormLabel>
              <FormControl>
                <MarkdownEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <File className="mr-2 h-4 w-4" />
              保存
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

async function updateArticle(values: ArticleDTO, editPageType: TagType, id: number | undefined) {
  if (id != null) {
    switch (editPageType) {
      case TagType.BLOG:
        await updateBlogById({ ...values, id })
        break
      case TagType.NOTE:
        await updateNoteById({ ...values, id })
        break
      default:
        throw new Error(`文章类型错误`)
    }
  } else {
    switch (editPageType) {
      case TagType.BLOG:
        await createBlog(values)
        break
      case TagType.NOTE:
        await createNote(values)
        break
      default:
        throw new Error(`文章类型错误`)
    }
  }
}
