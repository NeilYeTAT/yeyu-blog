import type { DeleteTagDTO } from '@/actions/tags/type'
import { TagType } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteBlogTagById, deleteNoteTagById } from '@/actions/tags'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/shadcn/dialog'

export default function DeleteTagModal() {
  const { modalType, payload, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'deleteTagModal'
  const values = payload != null ? (payload as DeleteTagDTO) : null

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: handleDeleteTag,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success(`删除标签 #${variables?.tagName} 成功`)
    },
    onError: (error, variables) => {
      if (error instanceof Error) {
        toast.error(`删除标签 ${variables?.tagName} 失败~ ${error.message}`)
      } else {
        toast.error(`删除标签 ${variables?.tagName} 出错~`)
      }
    },
  })

  async function onSubmit() {
    if (values == null) {
      toast.error(`标签信息不存在，删除出错`)
      return
    }
    mutate(values)
    onModalClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="flex flex-col items-center gap-4">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle>确定要删除该标签吗🥹</DialogTitle>
          <DialogDescription>不会删除关联的所有文章哦, 只是断开标签和文章的连接</DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          <Button
            onClick={onSubmit}
            variant="destructive"
            className="cursor-pointer"
            disabled={isPending}
            type="submit"
          >
            确定
          </Button>
          <Button variant="outline" onClick={onModalClose}>
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

async function handleDeleteTag({ tagType, id }: DeleteTagDTO) {
  switch (tagType) {
    case TagType.BLOG:
      await deleteBlogTagById(id)
      break
    case TagType.NOTE:
      await deleteNoteTagById(id)
      break
    default:
      throw new Error('标签类型错误或 id 不存在!')
  }
}
