import { BadRequestError } from '@/lib/common/errors/request'
import { noPermission } from '@/lib/core/auth/guard'
import { readJsonBody } from '@/lib/infra/http/read-json-body'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import {
  createTagSchema,
  deleteTagQuerySchema,
  getTagsQuerySchema,
  updateTagSchema,
} from './schema'

export const GET = withResponse(async request => {
  if (await noPermission()) {
    throw new BadRequestError('Insufficient permissions.')
  }

  const queryResult = getTagsQuerySchema.safeParse({
    q: request.nextUrl.searchParams.get('q') ?? undefined,
    take: request.nextUrl.searchParams.get('take') ?? undefined,
    skip: request.nextUrl.searchParams.get('skip') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { q, take, skip } = queryResult.data
  const where = q != null && q.length > 0 ? { tagName: { contains: q } } : undefined

  const blogTotal = await prisma.blogTag.count({ where })
  const total = blogTotal
  const blogSkip = Math.min(skip, blogTotal)
  const blogTake = Math.min(take, Math.max(blogTotal - blogSkip, 0))

  const blogTags =
    blogTake > 0
      ? await prisma.blogTag.findMany({
          where,
          include: {
            _count: true,
          },
          orderBy: {
            id: 'desc',
          },
          take: blogTake,
          skip: blogSkip,
        })
      : []

  const blogTagsWithCount = blogTags.map(tag => ({
    id: tag.id,
    tagName: tag.tagName,
    count: tag._count.blogs,
  }))

  return {
    list: blogTagsWithCount,
    total,
    take,
    skip,
  }
})

export const POST = withResponse(async request => {
  if (await noPermission()) {
    throw new BadRequestError('Insufficient permissions.')
  }

  const body = await readJsonBody(request)
  const parseResult = createTagSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const { tagName } = parseResult.data

  const existingTag = await prisma.blogTag.findFirst({ where: { tagName } })

  if (existingTag != null) {
    throw new BadRequestError('Tag name already exists.', { data: { tagName } })
  }

  const created = await prisma.blogTag.create({
    data: {
      tagName,
    },
  })

  return {
    message: 'Created.',
    data: created,
  }
})

export const PATCH = withResponse(async request => {
  if (await noPermission()) {
    throw new BadRequestError('Insufficient permissions.')
  }

  const body = await readJsonBody(request)
  const parseResult = updateTagSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const { id, tagName } = parseResult.data

  const existingTag = await prisma.blogTag.findUnique({ where: { id } })

  if (existingTag == null) {
    throw new BadRequestError('Tag not found.', { data: { id } })
  }

  const duplicateTag = await prisma.blogTag.findFirst({
    where: {
      tagName,
      NOT: { id },
    },
  })

  if (duplicateTag != null) {
    throw new BadRequestError('Tag name already exists.', { data: { id, tagName } })
  }

  const updated = await prisma.blogTag.update({
    where: { id },
    data: { tagName },
  })

  return {
    message: 'Updated.',
    data: updated,
  }
})

export const DELETE = withResponse(async request => {
  if (await noPermission()) {
    throw new BadRequestError('Insufficient permissions.')
  }

  const queryResult = deleteTagQuerySchema.safeParse({
    id: request.nextUrl.searchParams.get('id') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { id } = queryResult.data

  const existingTag = await prisma.blogTag.findUnique({ where: { id } })

  if (existingTag == null) {
    throw new BadRequestError('Tag not found.', { data: { id } })
  }

  await prisma.blogTag.delete({ where: { id } })

  return {
    message: 'Deleted.',
    id,
  }
})
