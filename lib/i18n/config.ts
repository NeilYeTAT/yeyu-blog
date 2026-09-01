export const languages = ['zh', 'en'] as const

export type Language = (typeof languages)[number]

export const defaultLanguage: Language = 'zh'

export const languageHtmlLang: Record<Language, string> = {
  zh: 'zh-CN',
  en: 'en',
}

export function isLanguage(value: string | undefined): value is Language {
  return languages.some(language => language === value)
}
