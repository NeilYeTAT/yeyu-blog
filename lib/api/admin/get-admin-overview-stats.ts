import { apiRequest } from '@/lib/infra/http/ky'

export type AdminOverviewStats = {
  blogCount: number
  noteCount: number
  blogDraftCount: number
  noteDraftCount: number
  draftCount: number
  commentPendingCount: number
  friendLinkPendingCount: number
  pendingCount: number
}

export async function getAdminOverviewStats() {
  return await apiRequest<AdminOverviewStats>({
    url: 'admin/overview',
    method: 'GET',
  })
}
