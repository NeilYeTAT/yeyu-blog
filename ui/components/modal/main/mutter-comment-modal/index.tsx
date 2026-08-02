'use client'

import type { PublicMutterCommentRecord } from '@/lib/api/mutter-comment/get-public-mutter-comments'
import { MessageCircle } from 'lucide-react'
import { type ComponentProps, type FC, startTransition, useMemo, useState } from 'react'
import { type Address, isAddress } from 'viem'
import { useMutterCommentDeleteMutation } from '@/hooks/api/mutter-comment/use-mutter-comment-delete-mutation'
import { useMutterCommentMutation } from '@/hooks/api/mutter-comment/use-mutter-comment-mutation'
import { usePublicMutterCommentQuery } from '@/hooks/api/mutter-comment/use-public-mutter-comment-query'
import { useSession } from '@/lib/core/auth/client'
import { isAdminLoggedIn, isEmailLoggedIn, isWalletLoggedIn } from '@/lib/core/auth/utils'
import { useModalActions, useModalPayload, useModalType } from '@/store/use-modal-store'
import { MainConfirmModal } from '@/ui/components/modal/main/main-confirm-modal'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { MutterCommentComposer } from './mutter-comment-composer'
import { MutterCommentList } from './mutter-comment-list'
import { MutterCommentSource } from './mutter-comment-source'

export const MutterCommentModal: FC<ComponentProps<'div'>> = () => {
  const modalType = useModalType()
  const payload = useModalPayload()
  const { closeModal, setModalOpen } = useModalActions()
  const isModalOpen = modalType === 'mutterCommentModal'
  const values =
    isModalOpen && payload != null
      ? (payload as {
          mutterId: number
          content: string
          createdAt: string
        })
      : null
  const mutterId = values?.mutterId ?? 0
  const [commentContent, setCommentContent] = useState('')
  const [deletingComment, setDeletingComment] = useState<PublicMutterCommentRecord | null>(null)
  const trimmedComment = commentContent.trim()

  const { data: session } = useSession()
  const isWalletUser = isWalletLoggedIn({ data: session ?? null })
  const isEmailUser = isEmailLoggedIn({ data: session ?? null })
  const isAdminUser = isAdminLoggedIn({ data: session ?? null })

  const isLoggedIn = useMemo(() => isEmailUser || isWalletUser, [isEmailUser, isWalletUser])

  const { data: commentListData, isLoading: isCommentListLoading } = usePublicMutterCommentQuery({
    mutterId,
    take: 50,
    enabled: isModalOpen && mutterId > 0,
  })
  const comments = commentListData?.list ?? []
  const { mutate: createComment, isPending: isCreatingComment } = useMutterCommentMutation()
  const { mutate: deleteComment, isPending: isDeletingComment } = useMutterCommentDeleteMutation()
  const sessionAddress = isAddress(session?.user?.name ?? '')
    ? (session?.user?.name as Address)
    : undefined
  const sessionAvatar = session?.user?.image?.trim() || undefined

  const handleSubmitComment = () => {
    if (!isLoggedIn || mutterId <= 0 || trimmedComment.length === 0) {
      return
    }

    createComment(
      {
        mutterId,
        content: trimmedComment,
      },
      {
        onSuccess: () => {
          setCommentContent('')
        },
      },
    )
  }

  const confirmDeleteComment = () => {
    if (deletingComment == null) {
      return
    }

    deleteComment(
      {
        id: deletingComment.id,
        mutterId: deletingComment.mutterId,
      },
      {
        onSuccess: () => {
          setDeletingComment(null)
        },
      },
    )
  }

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-h-[88vh] overflow-hidden rounded-2xl border-zinc-200 bg-theme-background/80 backdrop-blur-xl sm:max-w-[580px] dark:border-zinc-800 dark:bg-black/70">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 font-bold text-xl text-zinc-900 dark:text-zinc-100">
              <MessageCircle className="size-5 text-zinc-600 dark:text-zinc-300" />
              评论
            </DialogTitle>
          </DialogHeader>

          <MutterCommentSource values={values} />
          <MutterCommentList
            comments={comments}
            isCommentListLoading={isCommentListLoading}
            isDeletingComment={isDeletingComment}
            sessionUserId={session?.user?.id}
            onDeleteClick={setDeletingComment}
          />
          <MutterCommentComposer
            commentContent={commentContent}
            status={{
              isCreatingComment,
              isLoggedIn,
            }}
            trimmedComment={trimmedComment}
            viewer={{
              isAdminUser,
              isWalletUser,
              sessionAddress,
              sessionAvatar,
            }}
            onCommentChange={setCommentContent}
            onLoginClick={() => {
              startTransition(() => {
                setModalOpen('loginModal')
              })
            }}
            onSubmitComment={handleSubmitComment}
          />
        </DialogContent>
      </Dialog>

      <MainConfirmModal
        open={deletingComment != null}
        onClose={() => {
          setDeletingComment(null)
        }}
        onConfirm={confirmDeleteComment}
        title="确定要删除这条评论吗？"
        description="该操作不可撤销。"
        isPending={isDeletingComment}
      >
        {deletingComment != null ? (
          <div className="rounded-xl border border-theme-border/70 bg-theme-surface/55 p-3 text-sm dark:border-theme-dark-border/20 dark:bg-theme-dark-surface/35">
            <p className="font-medium">
              {deletingComment.user?.name ?? deletingComment.authorName}
            </p>
            <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-theme-muted-foreground text-xs dark:text-theme-dark-muted-foreground/75">
              {deletingComment.content}
            </p>
          </div>
        ) : null}
      </MainConfirmModal>
    </>
  )
}
