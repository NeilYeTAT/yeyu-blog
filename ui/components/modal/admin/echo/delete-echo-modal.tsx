import { sileo } from 'sileo'
import { useEchoDeleteMutation } from '@/hooks/api/echo/use-echo-delete-mutation'
import { useModalActions, useModalPayload, useModalType } from '@/store/use-modal-store'
import { ConfirmDialog } from '@/ui/components/modal/base/confirm-dialog'

export default function DeleteEchoModal() {
  const modalType = useModalType()
  const payload = useModalPayload()
  const { closeModal } = useModalActions()
  const isModalOpen = modalType === 'deleteEchoModal'
  const { id } = payload != null ? (payload as { id: number }) : {}

  const { mutate: deleteEcho, isPending } = useEchoDeleteMutation()

  function onSubmit() {
    if (id == null) {
      sileo.error({ title: '引用信息不存在，删除失败' })
      return
    }

    deleteEcho(
      { id },
      {
        onSuccess: closeModal,
      },
    )
  }

  return (
    <ConfirmDialog
      open={isModalOpen}
      onClose={closeModal}
      onConfirm={onSubmit}
      title="确定要删除这个引用吗🥹"
      description="真的会直接删除的喵🥹"
      isPending={isPending}
    />
  )
}
