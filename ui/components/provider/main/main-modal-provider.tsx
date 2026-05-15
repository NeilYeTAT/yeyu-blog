'use client'

import { lazy, Suspense } from 'react'
import { useModalStore } from '@/store/use-modal-store'
import { LoginModal } from '@/ui/components/modal/main/login-modal'
import Loading from '@/ui/components/shared/loading'
import { Dialog, DialogContent } from '@/ui/shadcn/dialog'

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
  const closeModal = useModalStore(s => s.closeModal)

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className="rounded-xl bg-theme-background/80 backdrop-blur-xl sm:max-w-96 dark:bg-black/70">
        <Loading />
      </DialogContent>
    </Dialog>
  )
}

export function MainModalProvider({
  children,
  friendLinkEmailPlaceholder,
}: {
  children: React.ReactNode
  friendLinkEmailPlaceholder?: string
}) {
  const modalType = useModalStore(s => s.modalType)

  return (
    <>
      {children}
      <Suspense fallback={<MainModalLoading />}>
        {modalType === 'loginModal' ? <LoginModal /> : null}
        {modalType === 'selectThemeModal' ? <SelectThemeModal /> : null}
        {modalType === 'mutterCommentModal' ? <MutterCommentModal /> : null}
        {modalType === 'friendLinkApplyModal' ? (
          <FriendLinkApplyModal emailPlaceholder={friendLinkEmailPlaceholder} />
        ) : null}
      </Suspense>
    </>
  )
}
