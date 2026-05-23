import type { CommentTreeNode, SessionAvatarProps } from './type'
import Loading from '@/ui/components/shared/loading'
import { CommentThreadItem } from './comment-thread-item'

export function CommentList({
  status,
  commentTree,
  sessionUserId,
  activeReplyCommentId,
  replyContent,
  sessionAvatarProps,
  onReplyClick,
  onReplyCancel,
  onReplyContentChange,
  onReplySubmit,
  onDeleteClick,
}: {
  status: {
    isCreatingComment: boolean
    isDeletingComment: boolean
    isLoggedIn: boolean
    isPending: boolean
  }
  commentTree: CommentTreeNode[]
  sessionUserId?: string
  activeReplyCommentId: number | null
  replyContent: string
  sessionAvatarProps: SessionAvatarProps
  onReplyClick: (commentId: number) => void
  onReplyCancel: () => void
  onReplyContentChange: (value: string) => void
  onReplySubmit: (commentId: number) => void
  onDeleteClick: (comment: CommentTreeNode) => void
}) {
  if (status.isPending) {
    return (
      <div className="flex min-h-24 items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (commentTree.length === 0) {
    return (
      <div className="px-1 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        评论会在这里按时间展开，回复会以缩进形式挂在对应楼层下面。
      </div>
    )
  }

  return (
    <ul className="space-y-5">
      {commentTree.map(comment => (
        <CommentThreadItem
          key={comment.id}
          comment={comment}
          depth={0}
          sessionUserId={sessionUserId}
          isLoggedIn={status.isLoggedIn}
          activeReplyCommentId={activeReplyCommentId}
          replyContent={replyContent}
          isCreatingComment={status.isCreatingComment}
          isDeletingComment={status.isDeletingComment}
          sessionAvatarProps={sessionAvatarProps}
          onReplyClick={onReplyClick}
          onReplyCancel={onReplyCancel}
          onReplyContentChange={onReplyContentChange}
          onReplySubmit={onReplySubmit}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </ul>
  )
}
