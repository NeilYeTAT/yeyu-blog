import type { Address } from 'viem'
import { LogIn } from 'lucide-react'
import Image from 'next/image'
import avatar from '@/config/img/avatar.webp'
import { AccountIcon } from '@/ui/components/shared/account-icon'
import { Button } from '@/ui/shadcn/button'
import { Textarea } from '@/ui/shadcn/textarea'

export function MutterCommentComposer({
  commentContent,
  status,
  trimmedComment,
  viewer,
  onCommentChange,
  onLoginClick,
  onSubmitComment,
}: {
  commentContent: string
  status: {
    isCreatingComment: boolean
    isLoggedIn: boolean
  }
  trimmedComment: string
  viewer: {
    isAdminUser: boolean
    isWalletUser: boolean
    sessionAddress?: Address
    sessionAvatar?: string
  }
  onCommentChange: (value: string) => void
  onLoginClick: () => void
  onSubmitComment: () => void
}) {
  return (
    <section className="mt-2 pt-2">
      {status.isLoggedIn ? (
        <div className="flex items-stretch gap-3.5">
          <div className="flex min-w-0 flex-1 flex-col">
            <Textarea
              placeholder="写下你的评论..."
              value={commentContent}
              onChange={event => {
                onCommentChange(event.target.value)
              }}
              className="min-h-24 resize-y rounded-xl border-zinc-200 bg-theme-background/80 text-sm dark:border-zinc-700 dark:bg-zinc-900/80"
            />
          </div>

          <div className="flex w-20 shrink-0 flex-col items-center justify-between gap-3">
            {viewer.isAdminUser ? (
              <span className="relative inline-flex">
                <Image
                  src={avatar}
                  alt="admin avatar"
                  width={40}
                  height={40}
                  className="size-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
                />
              </span>
            ) : viewer.isWalletUser || viewer.sessionAvatar == null ? (
              <AccountIcon
                account={viewer.sessionAddress}
                className="size-10 rounded-full border border-zinc-200 dark:border-zinc-700"
              />
            ) : (
              <Image
                src={viewer.sessionAvatar}
                alt="my avatar"
                width={40}
                height={40}
                className="size-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
              />
            )}

            <Button
              type="button"
              size="sm"
              className="h-9 w-full cursor-pointer rounded-xl bg-theme-accent text-white shadow-none hover:bg-[color-mix(in_srgb,var(--theme-accent)_92%,black)] hover:text-white focus-visible:ring-theme-ring/35 disabled:cursor-not-allowed disabled:bg-theme-accent disabled:text-white disabled:opacity-45"
              disabled={trimmedComment.length === 0 || status.isCreatingComment}
              onClick={onSubmitComment}
            >
              {status.isCreatingComment ? '稍等' : '发布'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-end">
          <Button
            type="button"
            className="h-10 w-full cursor-pointer rounded-xl bg-theme-accent text-white shadow-none hover:bg-[color-mix(in_srgb,var(--theme-accent)_92%,black)] hover:text-white focus-visible:ring-theme-ring/35"
            onClick={onLoginClick}
          >
            <LogIn className="size-4" />
            登录后评论
          </Button>
        </div>
      )}
    </section>
  )
}
