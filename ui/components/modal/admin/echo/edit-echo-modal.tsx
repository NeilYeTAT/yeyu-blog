'use client'

import type { UpdateEchoDTO } from '@/lib/api/echo/type'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { sileo } from 'sileo'
import { useEchoUpdateMutation } from '@/hooks/api/echo/use-echo-update-mutation'
import { updateEchoSchema } from '@/lib/api/echo/schema'
import { useModalActions, useModalPayload, useModalType } from '@/store/use-modal-store'
import { PublishedFormField, ReferenceFormField } from '@/ui/components/shared/admin-form-fields'
import { Button } from '@/ui/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/shadcn/form'
import { Textarea } from '@/ui/shadcn/textarea'

export default function EditEchoModal() {
  const modalType = useModalType()
  const payload = useModalPayload()
  const { closeModal } = useModalActions()
  const isModalOpen = modalType === 'editEchoModal'

  const { id, content, isPublished, reference } = payload != null ? (payload as UpdateEchoDTO) : {}

  const initialValues: UpdateEchoDTO = {
    content: content ?? '',
    reference: reference ?? '',
    isPublished: isPublished ?? true,
    id: id!,
  }

  const form = useForm<UpdateEchoDTO>({
    resolver: zodResolver(updateEchoSchema),
    defaultValues: {
      content: '',
      reference: '',
      isPublished: true,
      id: id!,
    },
    values: isModalOpen ? initialValues : undefined,
    mode: 'onBlur',
  })
  const { mutate: updateEcho, isPending } = useEchoUpdateMutation()

  function onSubmit(values: UpdateEchoDTO) {
    updateEcho(values, {
      onSuccess: () => {
        sileo.success({ title: '修改成功' })
        closeModal()
      },
      onError: error => {
        sileo.error({ title: `更新引用失败~ ${error.message}` })
      },
    })
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => {
        form.reset(initialValues)
        closeModal()
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑引用</DialogTitle>
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
                        className="h-52 resize-none"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ReferenceFormField control={form.control} name="reference" />

              <PublishedFormField control={form.control} name="isPublished" />
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
