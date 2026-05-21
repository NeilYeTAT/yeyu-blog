import { BadRequestError } from '@/lib/common/errors/request'
import { noPermission } from '@/lib/core/auth/guard'
import { readJsonBody } from '@/lib/infra/http/read-json-body'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import { updateCommentConfigSchema } from './schema'

const siteCommentConfigId = 1
const defaultSiteCommentConfig = {
  autoApproveEmailUsers: true,
  autoApproveWalletUsers: false,
}

const isMissingTableError = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as { code?: unknown }).code === 'P2021'

export const GET = withResponse(async () => {
  if (await noPermission()) {
    throw new BadRequestError('Insufficient permissions.')
  }

  let config: Awaited<ReturnType<typeof prisma.siteCommentConfig.upsert>>

  try {
    config = await prisma.siteCommentConfig.upsert({
      where: {
        id: siteCommentConfigId,
      },
      create: {
        id: siteCommentConfigId,
        ...defaultSiteCommentConfig,
      },
      update: {},
    })
  } catch (error) {
    if (isMissingTableError(error)) {
      throw new BadRequestError('Comment system is not initialized. Please run Prisma migration.')
    }

    throw error
  }

  return {
    data: config,
  }
})

export const PATCH = withResponse(async request => {
  if (await noPermission()) {
    throw new BadRequestError('Insufficient permissions.')
  }

  const body = await readJsonBody(request)
  const parseResult = updateCommentConfigSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const payload = parseResult.data

  let updated: Awaited<ReturnType<typeof prisma.siteCommentConfig.upsert>>

  try {
    updated = await prisma.siteCommentConfig.upsert({
      where: {
        id: siteCommentConfigId,
      },
      create: {
        id: siteCommentConfigId,
        ...payload,
      },
      update: payload,
    })
  } catch (error) {
    if (isMissingTableError(error)) {
      throw new BadRequestError('Comment system is not initialized. Please run Prisma migration.')
    }

    throw error
  }

  return {
    message: 'Updated.',
    data: updated,
  }
})
