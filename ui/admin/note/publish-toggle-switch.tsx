import { sileo } from 'sileo'
import { useNotePublishMutation } from '@/hooks/api/note/use-note-publish-mutation'
import { Switch } from '@/ui/shadcn/switch'

export default function PublishToggleSwitch({
  noteId,
  isPublished: initial,
}: {
  noteId: number
  isPublished: boolean
}) {
  const { mutate: toggleNotePublished, isPending } = useNotePublishMutation()

  const handleToggle = (newStatus: boolean) => {
    toggleNotePublished(
      {
        id: noteId,
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
