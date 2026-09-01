import type { Metadata } from 'next'
import { seoMetadata } from '@/config/seo'
import { getCurrentLanguage } from '@/lib/i18n/get-current-language'
import { FriendsPage } from '@/ui/(main)/friends'

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage()

  return seoMetadata[language].friends
}

export const revalidate = 3600

export default function Page() {
  return <FriendsPage />
}
