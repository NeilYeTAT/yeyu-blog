'use client'

import type { ComponentProps } from 'react'
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react'
import { cn } from '@/lib/utils/common/shadcn'
import { MainConfirmModal } from '@/ui/components/modal/main/main-confirm-modal'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { CommentCardHeader } from './comment-card-header'
import { CommentComposer } from './comment-composer'
import { CommentList } from './comment-list'
import { CommentLoginPrompt } from './comment-login-prompt'
import { useCommentCard } from './use-comment-card'

export default function CommentCard({
  articleId,
  className,
}: ComponentProps<'section'> & {
  articleId: number
}) {
  const translations = useTranslations()
  const {
    total,
    commentReferenceTime,
    commentTree,
    sortOrder,
    setSortOrder,
    commentContent,
    setCommentContent,
    replyContent,
    setReplyContent,
    activeReplyCommentId,
    isLoggedIn,
    isCommentPending,
    isCreatingComment,
    isDeletingComment,
    sessionUserId,
    sessionAvatarProps,
    deletingComment,
    setDeletingComment,
    openLoginModal,
    submitRootComment,
    handleReplyClick,
    cancelReply,
    submitReply,
    confirmDeleteComment,
  } = useCommentCard({ articleId })
  const nextSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
  const SortIcon = sortOrder === 'asc' ? ArrowUpNarrowWide : ArrowDownNarrowWide

  return (
    <>
      <section id="comments" className={cn('py-2 sm:py-4', className)}>
        <CommentCardHeader total={total} />

        <section className="mt-5 border-zinc-200/70 border-b pb-5 dark:border-zinc-800/70">
          {isLoggedIn ? (
            <CommentComposer
              value={commentContent}
              isSubmitting={isCreatingComment}
              sessionAvatarProps={sessionAvatarProps}
              placeholder={translations.comments.placeholder}
              submitLabel={translations.comments.publish}
              helperText={translations.comments.walletReview}
              onChange={setCommentContent}
              onSubmit={submitRootComment}
            />
          ) : (
            <CommentLoginPrompt onLoginClick={openLoginModal} />
          )}
        </section>

        <section className="mt-6 min-h-24">
          {total != null && total > 1 ? (
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-theme-accent dark:text-zinc-400 dark:hover:text-theme-accent"
                aria-label={translations.comments.switchSortOrder[nextSortOrder]}
                onClick={() => {
                  setSortOrder(nextSortOrder)
                }}
              >
                <SortIcon className="size-3.5" />
                <span>{translations.comments.sortOrder[sortOrder]}</span>
              </button>
            </div>
          ) : null}

          <CommentList
            status={{
              isCreatingComment,
              isDeletingComment,
              isLoggedIn,
              isPending: isCommentPending,
            }}
            commentTree={commentTree}
            commentReferenceTime={commentReferenceTime}
            sessionUserId={sessionUserId}
            activeReplyCommentId={activeReplyCommentId}
            replyContent={replyContent}
            sessionAvatarProps={sessionAvatarProps}
            onReplyClick={handleReplyClick}
            onReplyCancel={cancelReply}
            onReplyContentChange={setReplyContent}
            onReplySubmit={submitReply}
            onDeleteClick={setDeletingComment}
          />
        </section>
      </section>

      <MainConfirmModal
        open={deletingComment != null}
        onClose={() => {
          setDeletingComment(null)
        }}
        onConfirm={confirmDeleteComment}
        title={translations.comments.deleteTitle}
        description={translations.comments.deleteDescription}
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
