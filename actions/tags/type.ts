import { TagType } from '@prisma/client'
import { z } from 'zod'
import type { getAllTags } from '@/actions/tags'
import { TAG_NAME_MAX_LENGTH } from '@/config/constant'

export const CreateTagSchema = z.object({
  tagName: z
    .string()
    .min(1, { message: '标签名不能为空' })
    .max(TAG_NAME_MAX_LENGTH, { message: '标签名超出大小限制' }),
  tagType: z.nativeEnum(TagType),
})

export const UpdateTagNameSchema = z
  .object({
    id: z.number(),
  })
  .merge(CreateTagSchema)

export type CreateTagDTO = z.infer<typeof CreateTagSchema>
export type UpdateTagNameDTO = z.infer<typeof UpdateTagNameSchema>
export type DeleteTagDTO = UpdateTagNameDTO
export type WithCountTagDTO = z.infer<typeof UpdateTagNameSchema> & {
  count: number
}
export type Tag = Awaited<ReturnType<typeof getAllTags>>[number]
