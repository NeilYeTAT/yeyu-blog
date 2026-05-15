import type { Metadata } from 'next'
import HomePage from '@/ui/(main)/(home)'

export const metadata: Metadata = {
  title: '首页',
  description: '首页',
}

export default function Page() {
  return <HomePage />
}
