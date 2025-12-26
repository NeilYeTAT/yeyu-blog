'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/ui/shadcn/button'
import { useTransitionTheme } from '@/hooks/use-transition-theme'

export function ModeToggle() {
  const { setTransitionTheme, theme } = useTransitionTheme()

  return (
    <Button
      onClick={() => setTransitionTheme(theme === 'light' ? 'dark' : 'light', theme === 'light' ? 'bottom' : 'top')}
      size="sm"
      className='cursor-pointer'
    >
      {theme === 'light' ? <Sun /> : <Moon />}
    </Button>
  )
}
