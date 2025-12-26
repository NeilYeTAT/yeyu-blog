'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createEcho } from '@/actions/echos'
import type { CreateEchoDTO } from '@/actions/echos/type'
import { CreateEchoSchema } from '@/actions/echos/type'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useModalStore } from '@/store/use-modal-store'

export default function CreateEchoModal() {
  const { modalType, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'createEchoModal'
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: handleCreateEcho,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['echo-list'] })
      toast.success(`创建成功`)
    },
    onError: error => {
      if (error instanceof Error) {
        toast.error(`创建引用失败~ ${error.message}`)
      } else {
        toast.error(`创建引用失败~`)
      }
    },
  })

  const form = useForm<CreateEchoDTO>({
    resolver: zodResolver(CreateEchoSchema),
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
    mutation.mutate(values)
    onModalClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
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

              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>来源</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入来源" {...field} />
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
                    <FormLabel>是否发布</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="cursor-pointer">
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

async function handleCreateEcho(values: CreateEchoDTO) {
  await createEcho(values)
}
