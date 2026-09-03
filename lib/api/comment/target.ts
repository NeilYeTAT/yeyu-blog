import 'server-only'

import type { SiteCommentTargetType } from '@prisma/client'
import type { CommentTarget } from './type'
import { defaultLanguage } from '@/lib/i18n/config'
import { prisma } from '@/prisma/instance'

export const getSiteCommentTargetKey = (targetType: SiteCommentTargetType, targetId: number) =>
  `${targetType}:${targetId}`

export async function getSiteCommentTarget(
  targetType: SiteCommentTargetType,
  targetId: number,
): Promise<CommentTarget | null> {
  const blog = await prisma.blog.findUnique({
    where: {
      id: targetId,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      isPublished: true,
    },
  })

  if (blog == null) {
    return null
  }

  return {
    ...blog,
    targetType,
    path: `/${defaultLanguage}/blog/${blog.slug}`,
  }
}

export async function getSiteCommentTargetMap(
  targets: Array<{
    targetType: SiteCommentTargetType
    targetId: number
  }>,
) {
  const blogIdSet = new Set<number>()

  for (const target of targets) {
    blogIdSet.add(target.targetId)
  }

  const blogIds = Array.from(blogIdSet)

  const blogs =
    blogIds.length === 0
      ? []
      : await prisma.blog.findMany({
          where: {
            id: {
              in: blogIds,
            },
          },
          select: {
            id: true,
            title: true,
            slug: true,
            isPublished: true,
          },
        })

  const map = new Map<string, CommentTarget>()

  for (const blog of blogs) {
    map.set(getSiteCommentTargetKey('BLOG', blog.id), {
      ...blog,
      targetType: 'BLOG',
      path: `/${defaultLanguage}/blog/${blog.slug}`,
    })
  }

  return map
}
