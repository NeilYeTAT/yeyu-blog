'use client'

import type { ArticleDTO } from './type'
import type { Blog, BlogTag, Note, NoteTag } from '@prisma/client'
import type { FC } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { TagType } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { File, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createBlog, updateBlogById } from '@/actions/blogs'
import { createNote, updateNoteById } from '@/actions/notes'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import { Combobox } from '@/ui/shadcn/combobox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/shadcn/form'
import { Input } from '@/ui/shadcn/input'
import { Switch } from '@/ui/shadcn/switch'
import MarkdownEditor from './markdown-editor'
import { ArticleSchema } from './type'

// * 策略模式~
const STRATEGIES = {
  [TagType.BLOG]: {
    create: createBlog,
    update: updateBlogById,
    queryKey: 'blog-list',
    path: 'blog',
  },
  [TagType.NOTE]: {
    create: createNote,
    update: updateNoteById,
    queryKey: 'note-list',
    path: 'note',
  },
}

export const AdminArticleEditPage: FC<{
  article: Blog | Note | null
  relatedArticleTagNames?: string[]
  allTags: BlogTag[] | NoteTag[]
  type: TagType
}> = ({ article, relatedArticleTagNames, allTags, type }) => {
  const router = useRouter()
  const { setModalOpen } = useModalStore()
  const strategy = STRATEGIES[type]

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: ArticleDTO) => {
      if (article?.id != null) {
        return strategy.update({ ...values, id: article.id })
      }
      return strategy.create(values)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.invalidateQueries({ queryKey: [strategy.queryKey] })

      toast.success('保存成功')
      router.push(`/admin/${strategy.path}/edit/${variables.slug}`)
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(values => mutate(values))}
        className="w-full space-y-8 pb-44"
      >
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
