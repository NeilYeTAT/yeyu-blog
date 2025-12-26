'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { TagType } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { updateBlogTagById, updateNoteTagById } from '@/actions/tags'
import type { UpdateTagNameDTO } from '@/actions/tags/type'
import { UpdateTagNameSchema } from '@/actions/tags/type'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useModalStore } from '@/store/use-modal-store'

export default function EditTagModal() {
  const { modalType, onModalClose, payload } = useModalStore()
  const isModalOpen = modalType === 'editTagModal'
  const { id, tagName, tagType } = payload != null ? (payload as UpdateTagNameDTO) : {}

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: updateTagName,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success(`修改成功`)
    },
    onError: error => {
      if (error instanceof Error) {
        toast.error(`修改标签出错 ${error.message}`)
      } else {
        toast.error(`修改标签出错`)
      }
    },
  })

  const form = useForm<UpdateTagNameDTO>({
    resolver: zodResolver(UpdateTagNameSchema),
    mode: 'onBlur',
  })

  useEffect(() => {
    if (isModalOpen && tagName != null) {
      form.reset({
        id: id!,
        tagName: tagName!,
        tagType: tagType!,
      })
    }
  }, [isModalOpen, form, tagName, id, tagType])

  async function onSubmit(values: UpdateTagNameDTO) {
    mutate(values)
    onModalClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑标签</DialogTitle>
          <DialogDescription>修改标签名会影响所有关联的文章喵~</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="tagName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标签名</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入新的标签名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="cursor-pointer" disabled={isPending}>
                保存修改
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

async function updateTagName(values: UpdateTagNameDTO) {
  switch (values.tagType) {
    case TagType.BLOG:
      await updateBlogTagById(values)
      break
    case TagType.NOTE:
      await updateNoteTagById(values)
      break
    default:
      throw new Error('标签类型错误!')
  }
}
