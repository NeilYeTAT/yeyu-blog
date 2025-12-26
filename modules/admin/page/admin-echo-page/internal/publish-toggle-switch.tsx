'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { toggleEchoPublishedById } from '@/actions/echos'
import { Switch } from '@/ui/shadcn/switch'

export default function PublishToggleSwitch({
  echoId,
  isPublished: initial,
}: {
  echoId: number
  isPublished: boolean
}) {
  const [isPublished, setIsPublished] = useState(initial)
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()

  const handleToggle = async () => {
    const newStatus = !isPublished
    setIsPublished(newStatus)

    startTransition(async () => {
      try {
        await toggleEchoPublishedById(echoId, newStatus)
        queryClient.invalidateQueries({
          queryKey: ['echo-list'],
          exact: false,
        })
        toast.success(`更新成功`)
      } catch (error) {
        setIsPublished(!newStatus)
        if (error instanceof Error) {
          toast.error(`发布状态更新失败 ${error?.message}`)
        } else {
          toast.error(`发布状态更新失败`)
        }
      }
    })
  }

  return <Switch onCheckedChange={handleToggle} checked={isPublished} disabled={isPending} />
}
