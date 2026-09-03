'use client'

import type { CreateTagDTO } from '@/lib/api/tag/type'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { sileo } from 'sileo'
import { useTagCreateMutation } from '@/hooks/api/tag/use-tag-create-mutation'
import { createTagSchema } from '@/lib/api/tag/schema'
import { useModalActions, useModalType } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/shadcn/form'
import { Input } from '@/ui/shadcn/input'

export default function CreateTagModal() {
  const modalType = useModalType()
  const { closeModal } = useModalActions()
  const isModalOpen = modalType === 'createTagModal'
  const { mutate: createTag, isPending } = useTagCreateMutation()

  const form = useForm<CreateTagDTO>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      tagName: '',
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!isModalOpen) {
      form.reset()
    }
  }, [isModalOpen, form])

  function onSubmit(values: CreateTagDTO) {
    createTag(values, {
      onSuccess: () => {
        sileo.success({ title: '创建成功' })
        closeModal()
      },
      onError: error => {
        sileo.error({ title: `创建标签失败~ ${error.message}` })
      },
    })
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新建标签</DialogTitle>
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
                      <Input placeholder="请输入标签名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" className="cursor-pointer" disabled={isPending}>
                  保存
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
