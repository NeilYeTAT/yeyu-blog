import type { FC } from 'react'
import { Code } from 'lucide-react'
import Link from 'next/link'
import { defaultLanguage } from '@/lib/i18n/config'

export const AdminLogo: FC = () => {
  return (
    <Link className="flex items-center gap-1 hover:underline" href={`/${defaultLanguage}`}>
      <h2 className="font-semibold">叶鱼后台管理</h2>
      <Code size={18} />
    </Link>
  )
}
