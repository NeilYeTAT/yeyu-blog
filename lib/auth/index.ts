import { headers } from 'next/headers'
import { auth } from '@/auth'
import { ADMIN_EMAILS, ADMIN_WALLET_ADDRESS } from '@/config/constant'

// import from (https://github.com/aifuxi/fuxiaochen/blob/master/features/user/actions/index.ts)
// 感谢大佬带来的启发 🥹
export async function noPermission() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user?.id == null || session.user.email == null) {
    return true
  }

  const email = session.user.email

  // * 这里设计的其实不太合理，之后得想办法不使用 better auth
  // * 😭 回来吧 authjs
  // * 😭 我最骄傲的信仰
  // * 😭 历历在目的登录
  // * 😭 眼泪莫名在流淌
  // * 😭 一直记得 session
  // * 😭 还有给我的 callback
  // * 😭 把我 bug 都给挡住
  // * 😭 就算通宵也不慌 (写于 26.1.22 23:01)
  if (email.startsWith('0x') && ADMIN_WALLET_ADDRESS !== undefined) {
    const walletAddress = email.split('@')[0].toLowerCase()
    return walletAddress !== ADMIN_WALLET_ADDRESS
  }

  // 检查邮箱是否在管理员邮箱列表中
  if (ADMIN_EMAILS !== undefined && ADMIN_EMAILS.length > 0) {
    return !ADMIN_EMAILS.includes(email)
  }

  return true
}

export async function requireAdmin() {
  if (await noPermission()) {
    throw new Error('权限不够喵~')
  }
}
