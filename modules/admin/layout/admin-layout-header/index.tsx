'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getActiveAdminPath } from '@/lib/url'
import { Button } from '@/ui/shadcn/button'
import { ModeToggle } from '@/ui/shadcn/mode-toggle'
import AdminLogo from './internal/admin-logo'
import AvatarDropdownMenu from './internal/avatar-dropdown-menu'

const AdminRoutes = [
  {
    path: '/admin',
    pathName: '首页',
  },
  {
    path: '/admin/blog',
    pathName: '博客',
  },
  {
    path: '/admin/note',
    pathName: '笔记',
  },
  {
    path: '/admin/tag',
    pathName: '标签',
  },
  {
    path: '/admin/echo',
    pathName: '引用',
  },
] as const

function AdminNavbar() {
  const pathname = usePathname()
  const activeUrl = getActiveAdminPath(pathname)

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-dashed px-6 backdrop-blur-lg">
      <nav className="flex gap-4">
        {/* 左侧logo区域, 回到首页 */}
        <AdminLogo />
        {/* 路由 */}
        {AdminRoutes.map(link => (
          <Link href={link.path} key={link.path}>
            <Button
              className="cursor-pointer rounded-lg text-base"
              variant={activeUrl === link.path ? 'default' : 'ghost'}
              size="sm"
            >
              {link.pathName}
            </Button>
          </Link>
        ))}
      </nav>
      <section className="flex items-center gap-4">
        <ModeToggle />
        <AvatarDropdownMenu />
      </section>
    </header>
  )
}

export default AdminNavbar
