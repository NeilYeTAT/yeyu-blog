import { getCurrentLanguage } from '@/lib/i18n/get-current-language'
import MainLayout from '@/ui/(main)/main-layout'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const language = await getCurrentLanguage()

  return <MainLayout language={language}>{children}</MainLayout>
}
