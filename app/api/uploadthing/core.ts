import type { FileRouter } from 'uploadthing/next'
import { createUploadthing } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
import { noPermission } from '@/lib/auth'

const f = createUploadthing()

export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    // * 中间件校验
    .middleware(async () => {
      if (await noPermission()) throw new UploadThingError('权限不够~')

      return {}
    })
    .onUploadComplete(async () => {
      return {}
    }),
} satisfies FileRouter

export type OurFileRouter = typeof uploadRouter
