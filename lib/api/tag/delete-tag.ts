import type { DeleteTagDTO } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type DeleteTagResponse = {
  message: string
  id: number
}

export async function deleteTag(params: DeleteTagDTO) {
  const { id } = params

  return await apiRequest<DeleteTagResponse>({
    url: 'admin/tag',
    method: 'DELETE',
    searchParams: {
      id: String(id),
    },
  })
}
