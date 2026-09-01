import { useTranslations } from '@/ui/components/provider/main/language-provider'
import Loading from '@/ui/components/shared/loading'

export const LoginPendingPanel = () => {
  const translations = useTranslations()

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-2">
      <Loading />
      <p className="text-muted-foreground text-sm">{translations.loginModal.signingIn}</p>
    </div>
  )
}
