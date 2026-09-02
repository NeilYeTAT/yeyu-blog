'use client'

import { usePathname } from 'next/navigation'
import { createContext, use, useLayoutEffect, useState } from 'react'
import { seoMetadata } from '@/config/seo'
import { isLanguage, type Language, languageHtmlLang } from '@/lib/i18n/config'
import { getRoutePathname } from '@/lib/i18n/get-route-pathname'
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

function getDocumentTitle(pathname: string, language: Language, currentTitle: string) {
  const routePathname = getRoutePathname(pathname)
  const pageTitle =
    routePathname === '/'
      ? seoMetadata[language].home.title
      : routePathname === '/blog'
        ? seoMetadata[language].blog.title
        : routePathname === '/friends'
          ? seoMetadata[language].friends.title
          : currentTitle.replace(/\s*&\s*(?:叶鱼|Yuuri)$/, '')
  const siteName = language === 'en' ? 'Yuuri' : '叶鱼'

  return `${pageTitle} & ${siteName}`
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const routeLanguage = requireLanguage(pathname.split('/')[1] ?? '')
  const [targetLanguage, setTargetLanguage] = useState(routeLanguage)
  const isLanguageChanging = targetLanguage !== routeLanguage
  const language = isLanguageChanging ? targetLanguage : routeLanguage
  const nextLanguage = language === 'zh' ? 'en' : 'zh'
  const nextPathname = getLocalizedPathname(pathname, nextLanguage)

  useLayoutEffect(() => {
    document.documentElement.lang = languageHtmlLang[language]
    document.title = getDocumentTitle(pathname, language, document.title)
  }, [language, pathname])

  const toggleLanguage = () => {
    if (isLanguageChanging) return

    const url = new URL(window.location.href)

    url.pathname = nextPathname
    setTargetLanguage(nextLanguage)
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
