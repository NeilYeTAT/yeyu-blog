import { headers } from 'next/headers'
import { auth } from '@/auth'
import { ADMIN_EMAILS } from '@/config/constant'

// import from (https://github.com/aifuxi/fuxiaochen/blob/master/features/user/actions/index.ts)
// 感谢大佬带来的启发 🥹
export async function noPermission() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // 没有邮箱或者未配置admin邮箱，返回true，无权限
  if (session?.user?.email == null || ADMIN_EMAILS?.length == null) {
    return true
  } else {
    // 如果当前用户邮箱存在admin邮箱中，返回false，说明有权限
    return !ADMIN_EMAILS.includes(session.user.email)
  }
}

export async function requireAdmin() {
  if (await noPermission()) {
    throw new Error('权限不够喵~')
  }
}
