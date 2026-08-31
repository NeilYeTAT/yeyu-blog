import type { Metadata } from 'next'
import BlogListPage from '@/ui/(main)/blog'

export const metadata: Metadata = {
  title: '日志',
  description: '日志',
}

export default function Page() {
  return <BlogListPage />
}
