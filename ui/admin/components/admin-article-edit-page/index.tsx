'use client'

import type { Blog, Note } from '@prisma/client'
import type { UseFormReturn } from 'react-hook-form'
import type { ArticleDTO } from './type'
import { zodResolver } from '@hookform/resolvers/zod'
import { TagType } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { File, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FC, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { sileo } from 'sileo'
import { useBlogTagsQuery } from '@/hooks/api/tag/use-blog-tags-query'
import { useNoteTagsQuery } from '@/hooks/api/tag/use-note-tags-query'
import { createBlog } from '@/lib/api/blog/create-blog'
import { updateBlog } from '@/lib/api/blog/update-blog'
import { createNote } from '@/lib/api/note/create-note'
import { updateNote } from '@/lib/api/note/update-note'
import { useModalActions } from '@/store/use-modal-store'
import { PublishedFormField } from '@/ui/components/shared/admin-form-fields'
import { Button } from '@/ui/shadcn/button'
import { Combobox } from '@/ui/shadcn/combobox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/shadcn/form'
import { Input } from '@/ui/shadcn/input'
import MarkdownEditor from './markdown-editor'
import { ArticleSchema } from './type'
import { useMarkdownAutoSave } from './use-markdown-auto-save'

// * 策略模式~
const strategies = {
  [TagType.BLOG]: {
    create: createBlog,
    update: updateBlog,
    queryKey: 'blog-list',
    path: 'blog',
  },
  [TagType.NOTE]: {
    create: createNote,
    update: updateNote,
    queryKey: 'note-list',
    path: 'note',
  },
}

function syncMarkdownTitle(content: string, title: string): string {
  const normalizedTitle = title.trim()
  const lines = content.split(/\r?\n/)
  const firstLine = lines[0] ?? ''
  const hasHeading = /^#\s+/.test(firstLine)

  if (normalizedTitle.length === 0) {
    if (!hasHeading) return content

    lines.shift()
    if (lines[0] === '') {
      lines.shift()
    }
    return lines.join('\n')
  }

  const heading = `# ${normalizedTitle}`
  if (content.trim().length === 0) return heading

  if (hasHeading) {
    lines[0] = heading
    return lines.join('\n')
  }

  return `${heading}\n\n${content}`
}

function extractMarkdownH1Title(content: string): string | null {
  const firstLine = content.split(/\r?\n/, 1)[0] ?? ''
  const match = firstLine.match(/^#(?!#)\s*(.*)$/)
  if (match == null) return null
  return match[1].trim()
}

function updateTitleFromMarkdown(form: UseFormReturn<ArticleDTO>, content: string) {
  const markdownTitle = extractMarkdownH1Title(content)
  if (markdownTitle == null) return

  const currentTitle = form.getValues('title')
  if (markdownTitle !== currentTitle) {
    form.setValue('title', markdownTitle, {
      shouldValidate: true,
    })
  }
}

export const AdminArticleEditPage: FC<{
  article: Blog | Note | null
  relatedArticleTagNames?: string[]
  type: TagType
}> = ({ article, relatedArticleTagNames, type }) => {
  const { push } = useRouter()
  const { setModalOpen } = useModalActions()
  const strategy = strategies[type]
  const { data: blogTags } = useBlogTagsQuery({
    enabled: type === TagType.BLOG,
  })
  const { data: noteTags } = useNoteTagsQuery({
    enabled: type === TagType.NOTE,
  })
  const allTags = type === TagType.BLOG ? (blogTags ?? []) : (noteTags ?? [])

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
      if (type === TagType.BLOG) {
        queryClient.invalidateQueries({ queryKey: ['public-blog-list'] })
      }
      if (type === TagType.NOTE) {
        queryClient.invalidateQueries({ queryKey: ['public-note-list'] })
      }

      sileo.success({ title: '保存成功' })
      push(`/admin/${strategy.path}/edit/${variables.slug}`)
    },
    onError: error => {
      sileo.error({ title: `保存失败 ${error.message}` })
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
  const previewTitle = useWatch({ control: form.control, name: 'title' })
  const content = useWatch({ control: form.control, name: 'content' })
  const restoredContent = useMarkdownAutoSave(content)

  useEffect(() => {
    if (restoredContent == null || restoredContent === form.getValues('content')) return

    form.setValue('content', restoredContent, {
      shouldDirty: true,
      shouldValidate: true,
    })
    updateTitleFromMarkdown(form, restoredContent)
    sileo.info({ title: '已恢复未保存内容' })
  }, [form, restoredContent])

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
                <Input
                  placeholder="请输入标题"
                  {...field}
                  onChange={e => {
                    const nextTitle = e.target.value
                    field.onChange(nextTitle)

                    const currentContent = form.getValues('content')
                    const nextContent = syncMarkdownTitle(currentContent, nextTitle)

                    if (nextContent !== currentContent) {
                      form.setValue('content', nextContent, {
                        shouldValidate: true,
                      })
                    }
                  }}
                />
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

        <PublishedFormField control={form.control} name="isPublished" />

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
                <MarkdownEditor
                  value={field.value}
                  onChange={nextContent => {
                    field.onChange(nextContent)
                    updateTitleFromMarkdown(form, nextContent)
                  }}
                  previewTitle={previewTitle}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <File className="mr-2 size-4" />
              保存
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
