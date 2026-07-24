'use client'

import { lazy, Suspense } from 'react'
import { useModalActions, useModalType } from '@/store/use-modal-store'
import Loading from '@/ui/components/shared/loading'
import { Dialog, DialogContent } from '@/ui/shadcn/dialog'

const LoginModalContent = lazy(() =>
  import('./content').then(mod => ({ default: mod.LoginModalContent })),
)

export const LoginModal = () => {
  const modalType = useModalType()
  const { closeModal } = useModalActions()

  const isModalOpen = modalType === 'loginModal'

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="rounded-xl bg-theme-background/80 backdrop-blur-xl sm:max-w-96 dark:bg-black/70">
        <Suspense fallback={<Loading />}>
          <LoginModalContent />
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}
