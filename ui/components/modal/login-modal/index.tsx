import type { ComponentProps, FC } from 'react'
import { useModalStore } from '@/store/use-modal-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'

export const LoginModal: FC<ComponentProps<'div'>> = () => {
  const { modalType, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'loginModal'

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>登录</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
