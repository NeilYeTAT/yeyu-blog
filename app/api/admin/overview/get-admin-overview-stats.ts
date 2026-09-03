import 'server-only'

import type { AdminOverviewStats } from '@/lib/api/admin/get-admin-overview-stats'
import { prisma } from '@/prisma/instance'
import { getAdminPendingCount } from '../pending-count/get-admin-pending-count'

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  const [blogGroups, pendingCount] = await Promise.all([
    prisma.blog.groupBy({
      by: ['isPublished'],
      _count: { _all: true },
    }),
    getAdminPendingCount(),
  ])

  const blogCount = blogGroups.reduce((total, group) => total + group._count._all, 0)
  const blogDraftCount = blogGroups.reduce(
    (total, group) => total + (group.isPublished ? 0 : group._count._all),
    0,
  )

  return {
    blogCount,
    blogDraftCount,
    draftCount: blogDraftCount,
    commentPendingCount: pendingCount.commentPendingCount,
    friendLinkPendingCount: pendingCount.friendLinkPendingCount,
    pendingCount: pendingCount.pendingCount,
  }
}
