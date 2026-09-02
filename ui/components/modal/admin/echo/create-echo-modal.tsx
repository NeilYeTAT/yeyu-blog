'use client'

import type { CreateEchoDTO } from '@/lib/api/echo/type'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { sileo } from 'sileo'
import { useEchoCreateMutation } from '@/hooks/api/echo/use-echo-create-mutation'
import { createEchoSchema } from '@/lib/api/echo/schema'
import { useModalActions, useModalType } from '@/store/use-modal-store'
import { ReferenceFormField } from '@/ui/components/shared/admin-form-fields'
import { Button } from '@/ui/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/shadcn/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/shadcn/form'
import { Switch } from '@/ui/shadcn/switch'
import { Textarea } from '@/ui/shadcn/textarea'

export default function CreateEchoModal() {
  const modalType = useModalType()
  const { closeModal } = useModalActions()

  const isModalOpen = modalType === 'createEchoModal'
  const { mutate: createEcho, isPending } = useEchoCreateMutation()

  const form = useForm<CreateEchoDTO>({
    resolver: zodResolver(createEchoSchema),
    defaultValues: {
      content: '',
      reference: '',
      isPublished: true,
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!isModalOpen) {
      form.reset()
    }
  }, [isModalOpen, form])

  function onSubmit(values: CreateEchoDTO) {
    createEcho(values, {
      onSuccess: () => {
        sileo.success({ title: '创建成功' })
        closeModal()
      },
      onError: error => {
        sileo.error({ title: `创建引用失败~ ${error.message}` })
      },
    })
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>创建引用</DialogTitle>
          <DialogDescription>又看到什么有意思的东西了嘛~</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>引用</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="请输入新的引用"
                        {...field}
                        className="h-52 resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ReferenceFormField control={form.control} name="reference" />

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>是否发布</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="cursor-pointer" disabled={isPending}>
                  保存修改
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
