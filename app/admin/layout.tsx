import type { Metadata } from 'next'
import { seoMetadata } from '@/config/seo'
import { defaultLanguage } from '@/lib/i18n/config'
import AdminLayout from '@/ui/admin/admin-layout'

export const metadata: Metadata = seoMetadata[defaultLanguage].root

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
