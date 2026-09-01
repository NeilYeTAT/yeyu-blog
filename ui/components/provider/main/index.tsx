import type React from 'react'
import { LanguageProvider } from './language-provider'
import { MainModalProvider } from './main-modal-provider'

export default function MainProvider({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <MainModalProvider>{children}</MainModalProvider>
    </LanguageProvider>
  )
}
