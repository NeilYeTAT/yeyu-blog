import type { Metadata } from 'next'
import { seoMetadata } from '@/config/seo'
import { getCurrentLanguage } from '@/lib/i18n/get-current-language'
import BlogListPage from '@/ui/(main)/blog'

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage()

  return seoMetadata[language].blog
}

export default function Page() {
  return <BlogListPage />
}
