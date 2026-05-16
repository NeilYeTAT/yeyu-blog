import { BadRequestError } from '@/lib/common/errors/request'
import { noPermission } from '@/lib/core/auth/guard'
import { withResponse } from '@/lib/infra/http/with-response'
import { getAdminOverviewStats } from './get-admin-overview-stats'

export const GET = withResponse(async () => {
  if (await noPermission()) {
    throw new BadRequestError('Insufficient permissions.')
  }

  return await getAdminOverviewStats()
})
