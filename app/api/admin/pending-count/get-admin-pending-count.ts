import 'server-only'

import { prisma } from '@/prisma/instance'

export async function getAdminPendingCount() {
  const [siteCommentPendingCount, friendLinkPendingCount] = await Promise.all([
    prisma.siteComment.count({ where: { state: 'PENDING', targetType: 'BLOG' } }),
    prisma.friendLink.count({ where: { state: 'PENDING' } }),
  ])
  const commentPendingCount = siteCommentPendingCount

  return {
    siteCommentPendingCount,
    commentPendingCount,
    friendLinkPendingCount,
    pendingCount: commentPendingCount + friendLinkPendingCount,
  }
}
