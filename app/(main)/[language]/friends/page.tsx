import type { Metadata } from 'next'
import { seoMetadata } from '@/config/seo'
import { getRouteLanguage } from '@/lib/i18n/get-route-language'
import { FriendsPage } from '@/ui/(main)/friends'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string }>
}): Promise<Metadata> {
  const language = getRouteLanguage((await params).language)

  return seoMetadata[language].friends
}

export const revalidate = 3600

export default function Page() {
  return <FriendsPage />
}
