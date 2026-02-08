import { z } from 'zod'

// TODO: 区分 client 和 server 环境变量，不同地方导出
// -----------------------------------------------------------------------------
// Client Environment Variables
// -----------------------------------------------------------------------------

const publicEnvSchema = z.object({
  // * 允许访问后台的邮箱
  NEXT_PUBLIC_ADMIN_EMAILS: z.string().default(''),
  // * 允许访问后台的钱包地址
  NEXT_PUBLIC_ADMIN_WALLET_ADDRESS: z.string().optional(),
  // * 评论系统
  NEXT_PUBLIC_COMMENT_CARD_REPO_ID: z.string().default(''),
  // * 网站地址 (Client side)
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
})

const _clientEnv = {
  NEXT_PUBLIC_ADMIN_EMAILS: process.env.NEXT_PUBLIC_ADMIN_EMAILS,
  NEXT_PUBLIC_ADMIN_WALLET_ADDRESS: process.env.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS,
  NEXT_PUBLIC_COMMENT_CARD_REPO_ID: process.env.NEXT_PUBLIC_COMMENT_CARD_REPO_ID,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
}

export const clientEnv = publicEnvSchema.parse(_clientEnv)

// -----------------------------------------------------------------------------
// Server Environment Variables
// -----------------------------------------------------------------------------

const serverEnvSchema = z.object({
  // * 数据库地址
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // * 网站地址
  SITE_URL: z.string().url().optional(),

  // * 登录
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // * Better Auth
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.string().url().optional(),

  // * 上传图片
  UPLOADTHING_TOKEN: z.string().optional(),
})

let cachedServerEnv: z.infer<typeof serverEnvSchema> | null = null

export const getServerEnv = () => {
  if (typeof window !== 'undefined') {
    throw new Error('getServerEnv() can only be used on the server side')
  }

  if (cachedServerEnv) {
    return cachedServerEnv
  }

  const _serverEnv = {
    DATABASE_URL: process.env.DATABASE_URL,
    // Fallback to NEXT_PUBLIC_SITE_URL if SITE_URL is not set
    SITE_URL: process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
  }

  let parsed = serverEnvSchema.parse(_serverEnv)

  if (process.env.NODE_ENV === 'production') {
    const productionSchema = serverEnvSchema.extend({
      SITE_URL: z.string().url(),
      GITHUB_CLIENT_ID: z.string().min(1, 'GITHUB_CLIENT_ID is required in production'),
      GITHUB_CLIENT_SECRET: z.string().min(1, 'GITHUB_CLIENT_SECRET is required in production'),
      UPLOADTHING_TOKEN: z.string().min(1, 'UPLOADTHING_TOKEN is required in production'),
    })
    parsed = productionSchema.parse(_serverEnv)
  }

  cachedServerEnv = parsed
  return parsed
}
