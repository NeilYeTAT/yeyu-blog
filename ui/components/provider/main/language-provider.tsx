'use client'

import { usePathname } from 'next/navigation'
import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react'
import { isLanguage, type Language, languageHtmlLang } from '@/lib/i18n/config'
import { messages } from '@/lib/i18n/messages'

const LanguageContext = createContext<
  | {
      language: Language
      isLanguageChanging: boolean
      toggleLanguage: () => void
    }
  | undefined
>(undefined)

function getLocalizedPathname(pathname: string, language: Language) {
  const pathSegments = pathname.split('/')

  pathSegments[1] = language
  return pathSegments.join('/')
}

function requireLanguage(value: string) {
  if (!isLanguage(value)) {
    throw new Error(`Unsupported route language: ${value}`)
  }

  return value
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const routeLanguage = requireLanguage(pathname.split('/')[1] ?? '')
  const [pendingLanguage, setPendingLanguage] = useState<Language | null>(null)
  const language = pendingLanguage === null ? routeLanguage : pendingLanguage
  const isLanguageChanging = pendingLanguage !== null
  const nextLanguage = language === 'zh' ? 'en' : 'zh'
  const nextPathname = getLocalizedPathname(pathname, nextLanguage)

  useEffect(() => {
    if (pendingLanguage !== null && routeLanguage === pendingLanguage) {
      setPendingLanguage(null)
    }
  }, [pendingLanguage, routeLanguage])

  const toggleLanguage = useCallback(() => {
    if (pendingLanguage !== null) return

    const url = new URL(window.location.href)

    url.pathname = nextPathname
    setPendingLanguage(nextLanguage)
    document.documentElement.lang = languageHtmlLang[nextLanguage]
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
  }, [nextLanguage, nextPathname, pendingLanguage])

  const value = useMemo(
    () => ({
      language,
      isLanguageChanging,
      toggleLanguage,
    }),
    [isLanguageChanging, language, toggleLanguage],
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
