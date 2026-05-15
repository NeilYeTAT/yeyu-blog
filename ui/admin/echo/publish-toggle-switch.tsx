'use client'

import { sileo } from 'sileo'
import { useEchoPublishMutation } from '@/hooks/api/echo'
import { Switch } from '@/ui/shadcn/switch'

export default function PublishToggleSwitch({
  echoId,
  isPublished: initial,
}: {
  echoId: number
  isPublished: boolean
}) {
  const { mutate: toggleEchoPublish, isPending } = useEchoPublishMutation()

  const handleToggle = (newStatus: boolean) => {
    toggleEchoPublish(
      {
        id: echoId,
        isPublished: newStatus,
      },
      {
        onSuccess: () => {
          sileo.success({ title: '更新成功' })
        },
        onError: error => {
          sileo.error({ title: `发布状态更新失败 ${error.message}` })
        },
      },
    )
  }

  return <Switch onCheckedChange={handleToggle} checked={initial} disabled={isPending} />
}
