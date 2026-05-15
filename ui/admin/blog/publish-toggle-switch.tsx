import { sileo } from 'sileo'
import { useBlogPublishMutation } from '@/hooks/api/blog'
import { Switch } from '@/ui/shadcn/switch'

export default function PublishToggleSwitch({
  blogId,
  isPublished: initial,
}: {
  blogId: number
  isPublished: boolean
}) {
  const { mutate: toggleBlogPublished, isPending } = useBlogPublishMutation()

  const handleToggle = (newStatus: boolean) => {
    toggleBlogPublished(
      {
        id: blogId,
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
