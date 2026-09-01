export type PublicMutterCommentRecord = {
  id: number
  mutterId: number
  userId: string | null
  isAdmin: boolean
  authorName: string
  authorImage: string | null
  content: string
  isDeleted: boolean
  state: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    image: string | null
    accounts?: {
      providerId: string
      accountId: string
    }[]
  } | null
}
