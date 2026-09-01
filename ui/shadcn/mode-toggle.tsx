'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useIsHydrated } from '@/hooks/common/use-is-hydrated'
import { Button } from '@/ui/shadcn/button'

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const mounted = useIsHydrated()
  const currentTheme = mounted && resolvedTheme === 'dark' ? 'dark' : 'light'

  return (
    <Button
      onClick={() => setTheme(currentTheme === 'light' ? 'dark' : 'light')}
      size="sm"
      className="cursor-pointer"
    >
      {currentTheme === 'light' ? <Sun /> : <Moon />}
    </Button>
  )
}
