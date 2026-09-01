import { cookies } from 'next/headers'
import { defaultLanguage, isLanguage, languageCookieName } from './config'

export async function getCurrentLanguage() {
  const language = (await cookies()).get(languageCookieName)?.value

  return isLanguage(language) ? language : defaultLanguage
}
