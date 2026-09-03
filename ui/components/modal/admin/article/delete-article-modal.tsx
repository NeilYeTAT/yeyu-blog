import { sileo } from 'sileo'
import { useBlogDeleteMutation } from '@/hooks/api/blog/use-blog-delete-mutation'
import { useModalActions, useModalPayload, useModalType } from '@/store/use-modal-store'
import { ConfirmDialog } from '@/ui/components/modal/base/confirm-dialog'

export default function DeleteArticleModal() {
  const modalType = useModalType()
  const payload = useModalPayload()
  const { closeModal } = useModalActions()

  const isModalOpen = modalType === 'deleteArticleModal'
  const { id, title } =
    payload != null
      ? (payload as {
          id: number
          title: string
        })
      : {}

  const { mutate: deleteBlogById, isPending: isDeletingBlog } = useBlogDeleteMutation()
  const isPending = isDeletingBlog

  function onSubmit() {
    if (id == null || title == null) {
      sileo.error({ title: '文章信息不存在，删除失败' })
      return
    }

    const onSuccess = () => {
      sileo.success({ title: `删除文章「${title}」成功` })
      closeModal()
    }

    const onError = (error: unknown) => {
      if (error instanceof Error) {
        sileo.error({ title: `删除文章「${title}」失败：${error.message}` })
      } else {
        sileo.error({ title: `删除文章「${title}」失败` })
      }
    }

    deleteBlogById({ id }, { onSuccess, onError })
  }

  return (
    <ConfirmDialog
      open={isModalOpen}
      onClose={closeModal}
      onConfirm={onSubmit}
      title="确定要删除这篇文章吗🥹"
      description="真的会直接删除的喵🥹"
      isPending={isPending}
    />
  )
}
