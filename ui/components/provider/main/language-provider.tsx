'use client'

import { usePathname } from 'next/navigation'
import { createContext, use, useState } from 'react'
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
  const [targetLanguage, setTargetLanguage] = useState(routeLanguage)
  const isLanguageChanging = targetLanguage !== routeLanguage
  const language = isLanguageChanging ? targetLanguage : routeLanguage
  const nextLanguage = language === 'zh' ? 'en' : 'zh'
  const nextPathname = getLocalizedPathname(pathname, nextLanguage)

  const toggleLanguage = () => {
    if (isLanguageChanging) return

    const url = new URL(window.location.href)

    url.pathname = nextPathname
    setTargetLanguage(nextLanguage)
    document.documentElement.lang = languageHtmlLang[nextLanguage]
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
  }

  const value = {
    language,
    isLanguageChanging,
    toggleLanguage,
  }

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
