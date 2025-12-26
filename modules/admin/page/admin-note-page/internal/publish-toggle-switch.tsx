import { useQueryClient } from '@tanstack/react-query'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { toggleNotePublishedById } from '@/actions/notes'
import { Switch } from '@/components/ui/switch'

export default function PublishToggleSwitch({
  noteId,
  isPublished: initial,
}: {
  noteId: number
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
        await toggleNotePublishedById(noteId, newStatus)
        queryClient.invalidateQueries({
          queryKey: ['note-list'],
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
