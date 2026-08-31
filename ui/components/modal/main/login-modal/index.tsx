'use client'

import { lazy, Suspense } from 'react'
import { useSession } from '@/lib/core/auth/client'
import { isEmailLoggedIn, isWalletLoggedIn } from '@/lib/core/auth/utils'
import { useModalActions, useModalType } from '@/store/use-modal-store'
import { Modal } from '@/ui/components/interior/modal'
import Loading from '@/ui/components/shared/loading'

const LoginModalContent = lazy(() =>
  import('./content').then(mod => ({ default: mod.LoginModalContent })),
)

export const LoginModal = () => {
  const modalType = useModalType()
  const { closeModal } = useModalActions()
  const { data: session } = useSession()

  const isModalOpen = modalType === 'loginModal'
  const isLoggedIn = isEmailLoggedIn({ data: session }) || isWalletLoggedIn({ data: session })

  return (
    <Modal
      open={isModalOpen}
      onClose={closeModal}
      title={isLoggedIn ? '用户信息' : '登录 (ゝ∀･)'}
      closeLabel="关闭登录弹窗"
      maxWidth={440}
      className="border-theme-border/70 bg-theme-background/80 text-foreground backdrop-blur-xl dark:border-white/10 dark:bg-black/70"
      titleClassName="font-bold text-xl text-foreground"
    >
      <Suspense fallback={<Loading />}>
        <LoginModalContent />
      </Suspense>
    </Modal>
  )
}
