import { TagType } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteBlogById } from '@/actions/blogs'
import { deleteNoteById } from '@/actions/notes'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/shadcn/dialog'

interface DeleteArticleParams {
  id: number
  title: string
  articleType: TagType
}

export default function DeleteArticleModal() {
  const { modalType, payload, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'deleteArticleModal'
  const { id, title, articleType } = payload != null ? (payload as DeleteArticleParams) : {}

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: handleDeleteArticle,
    onSuccess: (_, variables) => {
      toast.success(`删除文章「${variables.title}」成功`)
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      switch (variables.articleType) {
        case TagType.BLOG:
          queryClient.invalidateQueries({ queryKey: ['blog-list'] })
          break
        case TagType.NOTE:
          queryClient.invalidateQueries({ queryKey: ['note-list'] })
          break
        default:
          throw new Error(`删除文章类型不匹配`)
      }
    },
    onError: (error, variables) => {
      if (error instanceof Error) {
        toast.error(`删除文章「${variables.title}」失败~ ${error.message}`)
      } else {
        toast.error(`删除文章「${variables.title}」出错~`)
      }
    },
  })

  async function onSubmit() {
    if (id == null || articleType == null || title == null) {
      return
    }
    mutate({ id, articleType, title })
    onModalClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="flex flex-col items-center gap-4">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle>确定要删除这篇文章吗🥹</DialogTitle>
          <DialogDescription>真的会直接删除的喵🥹</DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          <Button
            variant="destructive"
            className="cursor-pointer"
            type="submit"
            onClick={onSubmit}
            disabled={isPending}
          >
            {isPending ? '删除中...' : '确定'}
          </Button>
          <Button variant="outline" onClick={onModalClose}>
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

async function handleDeleteArticle({ id, articleType }: DeleteArticleParams) {
  switch (articleType) {
    case TagType.BLOG:
      await deleteBlogById(id)
      break
    case TagType.NOTE:
      await deleteNoteById(id)
      break
    default:
      throw new Error(`文章类型不正确`)
  }
}
