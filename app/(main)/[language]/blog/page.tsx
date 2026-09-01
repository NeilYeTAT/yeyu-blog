import type { Metadata } from 'next'
import { seoMetadata } from '@/config/seo'
import { getRouteLanguage } from '@/lib/i18n/get-route-language'
import BlogListPage from '@/ui/(main)/blog'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string }>
}): Promise<Metadata> {
  const language = getRouteLanguage((await params).language)

  return seoMetadata[language].blog
}

export default function Page() {
  return <BlogListPage />
}
