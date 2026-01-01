'use client'

import { LogOut } from 'lucide-react'
import { signOut, useSession } from '@/lib/auth/client'
import YeYuAvatar from '@/ui/components/shared/yeyu-avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/shadcn/dropdown-menu'

function AvatarDropdownMenu() {
  const { data: session } = useSession()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        <YeYuAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-lg">
        <DropdownMenuLabel className="flex items-center gap-2 p-1">
          <YeYuAvatar />
          <section>
            <h3 className="font-mono">{session?.user?.name != null || 'example'} </h3>
            <small className="font-thin">
              {session?.user?.email != null || 'example@gmail.com'}
            </small>
          </section>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            signOut()
          }}
        >
          <LogOut />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AvatarDropdownMenu
