import type { AdminFriendLinkRecord, FriendLinkState } from '@/lib/api/friend-link'
import { Check, ExternalLink, Mail, Pencil, RefreshCcw, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { prettyDateTime } from '@/lib/utils/common/time'
import { Badge } from '@/ui/shadcn/badge'
import { Button } from '@/ui/shadcn/button'
import { friendLinkStateBadgeVariantMap, friendLinkStateLabelMap } from './constants'

export function FriendLinkListItem({
  friendLink,
  isDeletingFriendLink,
  isUpdatingFriendLink,
  isUpdatingState,
  onDeleteClick,
  onEditClick,
  onUpdateState,
}: {
  friendLink: AdminFriendLinkRecord
  isDeletingFriendLink: boolean
  isUpdatingFriendLink: boolean
  isUpdatingState: boolean
  onDeleteClick: (friendLink: AdminFriendLinkRecord) => void
  onEditClick: (friendLink: AdminFriendLinkRecord) => void
  onUpdateState: (id: number, nextState: FriendLinkState) => void
}) {
  return (
    <li className="rounded-sm border bg-background p-3 shadow-xs">
      <section className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border bg-card">
            <Image
              src={friendLink.avatarUrl}
              alt={friendLink.name}
              width={56}
              height={56}
              unoptimized
              className="size-full object-cover"
            />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-medium text-sm">{friendLink.name}</h3>
              <Badge variant="outline">#{friendLink.id}</Badge>
              <Badge variant={friendLinkStateBadgeVariantMap[friendLink.state]}>
                {friendLinkStateLabelMap[friendLink.state]}
              </Badge>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{friendLink.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
              {friendLink.email != null ? (
                <a
                  href={`mailto:${friendLink.email}`}
                  className="inline-flex min-w-0 items-center gap-1 text-foreground underline underline-offset-4"
                >
                  <Mail className="size-3 shrink-0" />
                  <span className="truncate">{friendLink.email}</span>
                </a>
              ) : null}
              <Link
                href={friendLink.siteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-w-0 items-center gap-1 text-foreground underline underline-offset-4"
              >
                <span className="truncate">{friendLink.siteUrl}</span>
                <ExternalLink className="size-3 shrink-0" />
              </Link>
            </div>
            <time className="mt-1 block text-muted-foreground text-xs">
              {prettyDateTime(Date.parse(friendLink.createdAt))}
            </time>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="cursor-pointer"
            disabled={isUpdatingFriendLink}
            onClick={() => {
              onEditClick(friendLink)
            }}
          >
            <Pencil className="size-4" />
            修改
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="cursor-pointer"
            disabled={isUpdatingState || friendLink.state === 'APPROVED'}
            onClick={() => {
              onUpdateState(friendLink.id, 'APPROVED')
            }}
          >
            <Check className="size-4" />
            通过
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="cursor-pointer"
            disabled={isUpdatingState || friendLink.state === 'PENDING'}
            onClick={() => {
              onUpdateState(friendLink.id, 'PENDING')
            }}
          >
            <RefreshCcw className="size-4" />
            待审
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="cursor-pointer"
            disabled={isUpdatingState || friendLink.state === 'REJECTED'}
            onClick={() => {
              onUpdateState(friendLink.id, 'REJECTED')
            }}
          >
            <X className="size-4" />
            拒绝
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="cursor-pointer"
            disabled={isDeletingFriendLink}
            onClick={() => {
              onDeleteClick(friendLink)
            }}
          >
            <Trash2 className="size-4" />
            删除
          </Button>
        </div>
      </section>
    </li>
  )
}
