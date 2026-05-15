import type { ReactNode } from 'react'
import type { PublicMutterCommentRecord } from '@/lib/api/mutter-comment'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import { siGithub, siGoogle } from 'simple-icons'
import { type Address, isAddress } from 'viem'
import avatar from '@/config/img/avatar.webp'
import { prettyDateTime, toRelativeDate } from '@/lib/utils/time'
import { AccountIcon } from '@/ui/components/shared/account-icon'
import Loading from '@/ui/components/shared/loading'
import { Button } from '@/ui/shadcn/button'

function getMutterCommentLoginProvider(comment: PublicMutterCommentRecord) {
  if (comment.user?.accounts?.some(account => account.providerId === 'github')) {
    return 'github'
  }

  if (comment.user?.accounts?.some(account => account.providerId === 'google')) {
    return 'google'
  }

  return undefined
}

function getMutterCommentGithubAccountId(comment: PublicMutterCommentRecord) {
  const githubAccount = comment.user?.accounts?.find(account => account.providerId === 'github')

  return githubAccount?.accountId
}

function MutterCommentProviderIcon({ provider }: { provider: 'github' | 'google' }) {
  const icon = provider === 'github' ? siGithub : siGoogle

  return (
    <span
      className="absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full border border-white bg-white text-zinc-950 shadow-sm dark:border-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"
      title={icon.title}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className={provider === 'google' ? 'size-2.5 text-[#4285F4]' : 'size-2.5'}
      >
        <path d={icon.path} />
      </svg>
      <span className="sr-only">{icon.title}</span>
    </span>
  )
}

function MutterCommentAvatarFrame({
  children,
  displayName,
  githubAccountId,
  provider,
}: {
  children: ReactNode
  displayName: string
  githubAccountId?: string
  provider?: 'github' | 'google'
}) {
  const avatarContent = (
    <>
      {children}
      {provider != null ? <MutterCommentProviderIcon provider={provider} /> : null}
    </>
  )

  if (provider === 'github' && githubAccountId != null) {
    return (
      <a
        href={`/api/github-user/${encodeURIComponent(githubAccountId)}`}
        target="_blank"
        rel="noreferrer"
        className="relative inline-flex size-10 shrink-0 rounded-full outline-none transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-theme-indicator/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`打开 ${displayName} 的 GitHub 主页`}
      >
        {avatarContent}
      </a>
    )
  }

  return <span className="relative inline-flex size-10 shrink-0 rounded-full">{avatarContent}</span>
}

function MutterCommentItem({
  comment,
  isCurrentUserComment,
  isDeletingComment,
  onDeleteClick,
}: {
  comment: PublicMutterCommentRecord
  isCurrentUserComment: boolean
  isDeletingComment: boolean
  onDeleteClick: (comment: PublicMutterCommentRecord) => void
}) {
  const isDeletedComment = comment.isDeleted
  const commentCreatedAt = Date.parse(comment.createdAt)
  const displayName = comment.user?.name || comment.authorName
  const formattedDisplayName = isAddress(displayName)
    ? `${displayName.slice(0, 6)}...${displayName.slice(-6)}`
    : displayName
  const canDeleteComment = !isDeletedComment && isCurrentUserComment
  const commentAvatar = comment.user?.image?.trim() || comment.authorImage?.trim() || undefined
  const commentAddress = isAddress(comment.user?.name ?? '')
    ? (comment.user?.name as Address)
    : undefined
  const provider = getMutterCommentLoginProvider(comment)
  const githubAccountId = getMutterCommentGithubAccountId(comment)

  return (
    <li
      className={
        isCurrentUserComment
          ? 'flex flex-row-reverse items-start gap-3.5'
          : 'flex items-start gap-3.5'
      }
    >
      {comment.isAdmin ? (
        <MutterCommentAvatarFrame
          displayName={displayName}
          provider={provider}
          githubAccountId={githubAccountId}
        >
          <Image
            src={avatar}
            alt={displayName}
            width={40}
            height={40}
            className="size-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
          />
        </MutterCommentAvatarFrame>
      ) : commentAvatar != null ? (
        <MutterCommentAvatarFrame
          displayName={displayName}
          provider={provider}
          githubAccountId={githubAccountId}
        >
          <Image
            src={commentAvatar}
            alt={displayName}
            width={40}
            height={40}
            className="size-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
          />
        </MutterCommentAvatarFrame>
      ) : (
        <MutterCommentAvatarFrame
          displayName={displayName}
          provider={provider}
          githubAccountId={githubAccountId}
        >
          <AccountIcon
            account={commentAddress}
            className="size-10 rounded-full border border-zinc-200 dark:border-zinc-700"
          />
        </MutterCommentAvatarFrame>
      )}
      <div
        className={
          isCurrentUserComment
            ? 'flex min-w-0 flex-1 flex-col items-end'
            : 'flex min-w-0 flex-1 flex-col items-start'
        }
      >
        <div
          className={
            isCurrentUserComment
              ? 'flex items-center justify-end gap-2 text-right text-xs'
              : 'flex items-center gap-2 text-xs'
          }
        >
          <span
            className={
              comment.isAdmin
                ? 'max-w-40 truncate font-medium text-theme-indicator'
                : 'max-w-40 truncate font-medium text-zinc-800 dark:text-zinc-100'
            }
          >
            {formattedDisplayName}
          </span>
          <time
            className="text-zinc-500 dark:text-zinc-400"
            title={prettyDateTime(commentCreatedAt)}
            dateTime={comment.createdAt}
            suppressHydrationWarning
          >
            {toRelativeDate(commentCreatedAt)}
          </time>
          {isDeletedComment ? (
            <span className="text-zinc-400 dark:text-zinc-500">（已删除）</span>
          ) : null}
          {canDeleteComment ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="rounded-lg text-zinc-500 hover:text-destructive dark:text-zinc-400"
              aria-label="删除我的评论"
              disabled={isDeletingComment}
              onClick={() => {
                onDeleteClick(comment)
              }}
            >
              <Trash2 className="size-3.5" />
            </Button>
          ) : null}
        </div>
        <article className="mt-1 rounded-xl border border-[#00000022] bg-theme-background/80 px-4 py-2 text-[15px] text-zinc-900 leading-7 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
          <p
            className={
              isCurrentUserComment
                ? 'wrap-break-word whitespace-pre-wrap text-right'
                : 'wrap-break-word whitespace-pre-wrap'
            }
          >
            {isDeletedComment ? <del>已删除</del> : comment.content}
          </p>
        </article>
      </div>
    </li>
  )
}

export function MutterCommentList({
  comments,
  isCommentListLoading,
  isDeletingComment,
  sessionUserId,
  onDeleteClick,
}: {
  comments: PublicMutterCommentRecord[]
  isCommentListLoading: boolean
  isDeletingComment: boolean
  sessionUserId?: string
  onDeleteClick: (comment: PublicMutterCommentRecord) => void
}) {
  return (
    <section className="min-h-0">
      <div
        className="h-64 overflow-y-auto overscroll-contain py-1 pr-2 [scrollbar-color:rgba(113,113,122,0.45)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500/45 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-400/35 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-[3px]"
        onWheel={event => {
          event.stopPropagation()
        }}
      >
        {isCommentListLoading ? (
          <div className="flex h-full min-h-32 items-center justify-center">
            <Loading />
          </div>
        ) : comments.length === 0 ? (
          <div className="flex h-full min-h-32 items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
            还没有评论，来发表第一条评论吧
          </div>
        ) : (
          <ul className="space-y-3 py-1">
            {comments.map(comment => (
              <MutterCommentItem
                key={comment.id}
                comment={comment}
                isCurrentUserComment={sessionUserId != null && comment.userId === sessionUserId}
                isDeletingComment={isDeletingComment}
                onDeleteClick={onDeleteClick}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
