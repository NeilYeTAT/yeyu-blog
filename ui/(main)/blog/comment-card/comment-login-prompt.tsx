import { LogIn } from 'lucide-react'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { Button } from '@/ui/shadcn/button'

export function CommentLoginPrompt({ onLoginClick }: { onLoginClick: () => void }) {
  const translations = useTranslations()

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {translations.comments.loginPrompt}
      </p>
      <Button
        type="button"
        className="h-9 rounded-xl bg-theme-accent px-4 text-white shadow-none hover:bg-[color-mix(in_srgb,var(--theme-accent)_92%,black)] hover:text-white focus-visible:ring-theme-ring/35"
        onClick={onLoginClick}
      >
        <LogIn className="size-4" />
        {translations.comments.loginToComment}
      </Button>
    </div>
  )
}
