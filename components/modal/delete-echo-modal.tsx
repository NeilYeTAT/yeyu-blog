import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModalStore } from '@/store/use-modal-store'

export default function DeleteEchoModal() {
  const { modalType, payload, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'deleteEchoModal'

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="flex flex-col items-center gap-4">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle>确定要删除这个引用吗🥹</DialogTitle>
          <DialogDescription>真的会直接删除的喵🥹</DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => {
              typeof payload === 'function' && payload()
              onModalClose()
            }}
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
