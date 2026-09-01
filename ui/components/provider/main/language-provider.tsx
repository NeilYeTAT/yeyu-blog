'use client'

import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react'
import { type Language, languageCookieName, languageHtmlLang } from '@/lib/i18n/config'
import { messages } from '@/lib/i18n/messages'

const languageCookieMaxAge = 60 * 60 * 24 * 365

const LanguageContext = createContext<
  | {
      language: Language
      toggleLanguage: () => void
    }
  | undefined
>(undefined)

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: React.ReactNode
  initialLanguage: Language
}) {
  const [language, setLanguage] = useState(initialLanguage)

  useEffect(() => {
    document.documentElement.lang = languageHtmlLang[language]
  }, [language])

  const toggleLanguage = useCallback(() => {
    const nextLanguage = language === 'zh' ? 'en' : 'zh'

    setLanguage(nextLanguage)
    document.documentElement.lang = languageHtmlLang[nextLanguage]
    document.cookie = `${languageCookieName}=${nextLanguage}; Path=/; Max-Age=${languageCookieMaxAge}; SameSite=Lax`
  }, [language])

  const value = useMemo(
    () => ({
      language,
      toggleLanguage,
    }),
    [language, toggleLanguage],
  )

  return <LanguageContext value={value}>{children}</LanguageContext>
}

export function useLanguage() {
  const context = use(LanguageContext)

  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }

  return context
}

export function useTranslations() {
  const { language } = useLanguage()

  return messages[language]
}
