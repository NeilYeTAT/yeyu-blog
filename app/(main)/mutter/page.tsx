import type { Metadata } from 'next'
import MutterPage from '@/ui/(main)/mutter'

export const metadata: Metadata = {
  title: '低语',
  description: '低语',
}

export default function Page() {
  return <MutterPage />
}
