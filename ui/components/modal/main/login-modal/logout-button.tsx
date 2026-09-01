import { useRef } from 'react'
import { signOut, useSession } from '@/lib/core/auth/client'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { Button } from '@/ui/shadcn/button'
import { LogoutIcon, type LogoutIconHandle } from '@/ui/shadcn/logout'

export function LogoutButton() {
  const iconRef = useRef<LogoutIconHandle>(null)
  const { refetch: refetchSession } = useSession()
  const translations = useTranslations()

  const handleSignOut = async () => {
    await signOut()
    await refetchSession()
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleSignOut}
      className="h-10 w-full cursor-pointer rounded-xl border-destructive/25 bg-destructive/5 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive/25 dark:border-destructive/30 dark:bg-destructive/10"
      onMouseEnter={() => {
        iconRef.current?.startAnimation()
      }}
      onMouseLeave={() => {
        iconRef.current?.stopAnimation()
      }}
    >
      <LogoutIcon ref={iconRef} className="size-4" size={16} />
      {translations.loginModal.logout}
    </Button>
  )
}
