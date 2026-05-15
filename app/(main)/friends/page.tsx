import type { Metadata } from 'next'
import { FriendsPage } from '@/ui/(main)/friends'

export const metadata: Metadata = {
  title: '友链',
  description: '友链',
}

export default function Page() {
  return <FriendsPage />
}
