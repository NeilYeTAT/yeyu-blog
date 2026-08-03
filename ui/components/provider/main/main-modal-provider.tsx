'use client'

import { lazy, Suspense, useEffect, useState } from 'react'
import { useModalActions, useModalType } from '@/store/use-modal-store'
import { Modal } from '@/ui/components/interior/modal'
import { LoginModal } from '@/ui/components/modal/main/login-modal'
import Loading from '@/ui/components/shared/loading'

const modalExitDuration = 180

const SelectThemeModal = lazy(() =>
  import('@/ui/components/modal/main/select-theme-modal').then(mod => ({
    default: mod.SelectThemeModal,
  })),
)

const MutterCommentModal = lazy(() =>
  import('@/ui/components/modal/main/mutter-comment-modal').then(mod => ({
    default: mod.MutterCommentModal,
  })),
)

const FriendLinkApplyModal = lazy(() =>
  import('@/ui/components/modal/main/friend-link-apply-modal').then(mod => ({
    default: mod.FriendLinkApplyModal,
  })),
)

const MainModalLoading = () => {
  const modalType = useModalType()
  const { closeModal } = useModalActions()

  return (
    <Modal
      open={modalType !== null}
      onClose={closeModal}
      title={<span className="sr-only">正在加载</span>}
      closeLabel="关闭弹窗"
      maxWidth={384}
      className="border-theme-border/70 bg-theme-background/80 text-foreground backdrop-blur-xl dark:border-theme-dark-border/20 dark:bg-black/70"
    >
      <Loading />
    </Modal>
  )
}

export function MainModalProvider({ children }: { children: React.ReactNode }) {
  const modalType = useModalType()
  const [renderedModalType, setRenderedModalType] = useState(modalType)
  const activeModalType = modalType ?? renderedModalType

  useEffect(() => {
    if (modalType !== null) {
      setRenderedModalType(modalType)
      return
    }

    const closeTimerId = window.setTimeout(() => {
      setRenderedModalType(null)
    }, modalExitDuration)

    return () => {
      window.clearTimeout(closeTimerId)
    }
  }, [modalType])

  return (
    <>
      {children}
      <Suspense fallback={<MainModalLoading />}>
        {activeModalType === 'loginModal' ? <LoginModal /> : null}
        {activeModalType === 'selectThemeModal' ? <SelectThemeModal /> : null}
        {activeModalType === 'mutterCommentModal' ? <MutterCommentModal /> : null}
        {activeModalType === 'friendLinkApplyModal' ? <FriendLinkApplyModal /> : null}
      </Suspense>
    </>
  )
}
