import type { DeleteTagDTO } from '@/lib/api/tag/type'
import { sileo } from 'sileo'
import { useTagDeleteMutation } from '@/hooks/api/tag/use-tag-delete-mutation'
import { useModalActions, useModalPayload, useModalType } from '@/store/use-modal-store'
import { ConfirmDialog } from '@/ui/components/modal/base/confirm-dialog'

export default function DeleteTagModal() {
  const modalType = useModalType()
  const payload = useModalPayload()
  const { closeModal } = useModalActions()
  const isModalOpen = modalType === 'deleteTagModal'
  const values = payload != null ? (payload as DeleteTagDTO) : null

  const { mutate: deleteTag, isPending } = useTagDeleteMutation()

  function onSubmit() {
    if (values == null) {
      sileo.error({ title: '标签信息不存在，删除失败' })
      return
    }

    deleteTag(values, {
      onSuccess: closeModal,
    })
  }

  return (
    <ConfirmDialog
      open={isModalOpen}
      onClose={closeModal}
      onConfirm={onSubmit}
      title="确定要删除该标签吗🥹"
      description="不会删除关联的所有文章哦，只是断开标签和文章的连接。"
      isPending={isPending}
    />
  )
}
