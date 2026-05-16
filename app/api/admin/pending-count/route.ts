import { BadRequestError } from '@/lib/common/errors/request'
import { noPermission } from '@/lib/core/auth/guard'
import { withResponse } from '@/lib/infra/http/with-response'
import { getAdminPendingCount } from './get-admin-pending-count'

export const GET = withResponse(async () => {
  if (await noPermission()) {
    throw new BadRequestError('Insufficient permissions.')
  }

  return await getAdminPendingCount()
})
