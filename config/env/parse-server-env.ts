import { isAddress } from 'viem'
import { z } from 'zod'

const emptyStringToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value

const optionalEnvString = z.preprocess(emptyStringToUndefined, z.string().trim().min(1).optional())

const emailList = z
  .string()
  .transform(value => value.split(',').map(email => email.trim()))
  .pipe(z.array(z.email()).min(1))

const adminEmailList = z
  .string()
  .transform(value => value.split(/[\s,]+/).filter(Boolean))
  .pipe(z.array(z.email()).min(1))
  .transform(emails => emails.map(email => email.toLowerCase()))

const optionalEmailList = z.preprocess(emptyStringToUndefined, emailList.optional())

const optionalMailFrom = z.preprocess(
  emptyStringToUndefined,
  z
    .string()
    .trim()
    .refine(value => {
      const bracketedEmail = value.match(/<([^<>]+)>$/)?.[1]

      if (bracketedEmail !== undefined) {
        return z.email().safeParse(bracketedEmail).success
      }

      return z.email().safeParse(value).success
    }, 'MAIL_FROM must contain a valid email address')
    .optional(),
)

const smtpConfigKeys = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASS',
  'MAIL_FROM',
] as const

const serverEnvSchema = z
  .object({
    // * 数据库地址
    DATABASE_URL: z
      .url()
      .refine(
        value => value.startsWith('postgresql://') || value.startsWith('postgres://'),
        'DATABASE_URL must be a PostgreSQL URL',
      ),

    // * 网站地址
    SITE_URL: z
      .url()
      .refine(
        value => value.startsWith('http://') || value.startsWith('https://'),
        'SITE_URL must use HTTP or HTTPS',
      )
      .transform(value => new URL(value).origin),

    // * 管理员权限
    ADMIN_EMAILS: adminEmailList,
    ADMIN_WALLET_ADDRESS: z.preprocess(
      emptyStringToUndefined,
      z
        .string()
        .refine(isAddress, 'ADMIN_WALLET_ADDRESS must be an Ethereum address')
        .transform(value => value.toLowerCase())
        .optional(),
    ),

    // * 登录
    GITHUB_CLIENT_ID: z.string().trim().min(1, 'GITHUB_CLIENT_ID is required'),
    GITHUB_CLIENT_SECRET: z.string().trim().min(1, 'GITHUB_CLIENT_SECRET is required'),
    GOOGLE_CLIENT_ID: z.string().trim().min(1, 'GOOGLE_CLIENT_ID is required'),
    GOOGLE_CLIENT_SECRET: z.string().trim().min(1, 'GOOGLE_CLIENT_SECRET is required'),

    // * Better Auth
    BETTER_AUTH_SECRET: z.string().min(32, 'BETTER_AUTH_SECRET must be at least 32 characters'),

    // * 上传图片
    UPLOADTHING_TOKEN: z.string().trim().min(1, 'UPLOADTHING_TOKEN is required'),

    // * 邮件通知
    SMTP_HOST: optionalEnvString,
    SMTP_PORT: z.preprocess(
      emptyStringToUndefined,
      z.coerce.number().int().min(1).max(65535).optional(),
    ),
    SMTP_SECURE: z.preprocess(
      emptyStringToUndefined,
      z
        .enum(['true', 'false'])
        .transform(value => value === 'true')
        .optional(),
    ),
    SMTP_USER: optionalEnvString,
    SMTP_PASS: z.preprocess(
      emptyStringToUndefined,
      z
        .string()
        .transform(value => value.replace(/\s/g, ''))
        .pipe(z.string().min(1))
        .optional(),
    ),
    MAIL_FROM: optionalMailFrom,
    MAIL_TO: optionalEmailList,
  })
  .superRefine((env, context) => {
    const configuredSmtpKeys = smtpConfigKeys.filter(key => env[key] !== undefined)

    if (configuredSmtpKeys.length > 0 && configuredSmtpKeys.length < smtpConfigKeys.length) {
      const missingSmtpKeys = smtpConfigKeys.filter(key => env[key] === undefined)
      context.addIssue({
        code: 'custom',
        message: `SMTP configuration is incomplete. Missing: ${missingSmtpKeys.join(', ')}`,
      })
    }

    if (env.MAIL_TO !== undefined && configuredSmtpKeys.length === 0) {
      context.addIssue({
        code: 'custom',
        path: ['MAIL_TO'],
        message: 'MAIL_TO requires SMTP configuration',
      })
    }
  })

export const parseServerEnv = () => serverEnvSchema.parse(process.env)
