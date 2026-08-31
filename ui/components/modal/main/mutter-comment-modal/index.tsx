'use client'

import type { PublicMutterCommentRecord } from '@/lib/api/mutter-comment/get-public-mutter-comments'
import { MessageCircle } from 'lucide-react'
import { startTransition, useState } from 'react'
import { type Address, isAddress } from 'viem'
import { useMutterCommentDeleteMutation } from '@/hooks/api/mutter-comment/use-mutter-comment-delete-mutation'
import { useMutterCommentMutation } from '@/hooks/api/mutter-comment/use-mutter-comment-mutation'
import { usePublicMutterCommentQuery } from '@/hooks/api/mutter-comment/use-public-mutter-comment-query'
import { useSession } from '@/lib/core/auth/client'
import { isAdminLoggedIn, isEmailLoggedIn, isWalletLoggedIn } from '@/lib/core/auth/utils'
import { useModalActions, useModalPayload, useModalType } from '@/store/use-modal-store'
import { Modal } from '@/ui/components/interior/modal'
import { MainConfirmModal } from '@/ui/components/modal/main/main-confirm-modal'
import { MutterCommentComposer } from './mutter-comment-composer'
import { MutterCommentList } from './mutter-comment-list'
import { MutterCommentSource } from './mutter-comment-source'

export const MutterCommentModal = () => {
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

  const isLoggedIn = isEmailUser || isWalletUser

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
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={
          <span className="flex items-center justify-center gap-2">
            <MessageCircle className="size-5 text-zinc-600 dark:text-zinc-300" />
            评论
          </span>
        }
        closeLabel="关闭评论弹窗"
        maxWidth={580}
        maxHeight="88vh"
        className="border-zinc-200 bg-theme-background/80 text-zinc-900 backdrop-blur-xl dark:border-zinc-800 dark:bg-black/70 dark:text-zinc-100"
        titleClassName="text-center font-bold text-xl text-zinc-900 dark:text-zinc-100"
      >
        <div className="grid gap-4">
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
        </div>
      </Modal>

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
          <div className="rounded-xl border border-theme-border/70 bg-theme-surface/55 p-3 text-sm dark:border-white/10 dark:bg-zinc-900/35">
            <p className="font-medium">
              {deletingComment.user?.name ?? deletingComment.authorName}
            </p>
            <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-xs text-zinc-600 dark:text-zinc-400">
              {deletingComment.content}
            </p>
          </div>
        ) : null}
      </MainConfirmModal>
    </>
  )
}
