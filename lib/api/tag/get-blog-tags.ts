import type { GetTagsResponse } from './get-tags'
import type { TagOptionRecord } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export async function getBlogTags() {
  const response = await apiRequest<GetTagsResponse>({
    url: 'admin/tag',
    method: 'GET',
    searchParams: {
      take: '100',
      skip: '0',
    },
  })

  return response.list.map(({ id, tagName }): TagOptionRecord => ({ id, tagName }))
}
