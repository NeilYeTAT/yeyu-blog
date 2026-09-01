import type React from 'react'
import type { Language } from '@/lib/i18n/config'
import { LanguageProvider } from './language-provider'
import { MainModalProvider } from './main-modal-provider'

export default function MainProvider({
  children,
  initialLanguage,
}: {
  children: React.ReactNode
  initialLanguage: Language
}) {
  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <MainModalProvider>{children}</MainModalProvider>
    </LanguageProvider>
  )
}
