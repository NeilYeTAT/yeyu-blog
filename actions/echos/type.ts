import { z } from 'zod'
import { ECHO_CONTENT_MAX_LENGTH, ECHO_REFERENCE_MAX_LENGTH } from '@/config/constant'

export const CreateEchoSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: '引用不能为空' })
    .max(ECHO_CONTENT_MAX_LENGTH, { message: '引用长度过长' }),
  reference: z
    .string()
    .min(1, { message: '来源不能为空' })
    .max(ECHO_REFERENCE_MAX_LENGTH, { message: '来源长度过长' }),
  isPublished: z.boolean(),
})

export const UpdateEchoSchema = z
  .object({
    id: z.number(),
  })
  .merge(CreateEchoSchema)

export type CreateEchoDTO = z.infer<typeof CreateEchoSchema>
export type UpdateEchoDTO = z.infer<typeof UpdateEchoSchema>
