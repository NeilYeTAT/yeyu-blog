'use client'

import ReactQueryProvider from '@/ui/components/provider/react-query-provider'
import CommentCard from './index'

export default function DeferredCommentCardContent({ articleId }: { articleId: number }) {
  return (
    <ReactQueryProvider>
      <CommentCard articleId={articleId} />
    </ReactQueryProvider>
  )
}
