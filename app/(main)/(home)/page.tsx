import type { Metadata } from 'next'
import { seoMetadata } from '@/config/seo'
import { getCurrentLanguage } from '@/lib/i18n/get-current-language'
import HomePage from '@/ui/(main)/(home)'

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage()

  return seoMetadata[language].home
}

export default function Page() {
  return <HomePage />
}
