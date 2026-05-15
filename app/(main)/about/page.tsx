import type { Metadata } from 'next'
import AboutPage from '@/ui/(main)/about'

export const metadata: Metadata = {
  title: '关于',
  description: '关于',
}

export default function Page() {
  return <AboutPage />
}
