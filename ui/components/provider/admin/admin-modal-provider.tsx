'use client'

import DeleteArticleModal from '@/ui/components/modal/admin/article/delete-article-modal'
import CreateTagModal from '@/ui/components/modal/admin/tag/create-tag-modal'
import DeleteTagModal from '@/ui/components/modal/admin/tag/delete-tag-modal'
import EditTagModal from '@/ui/components/modal/admin/tag/edit-tag-modal'

export function AdminModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <DeleteArticleModal />
      <EditTagModal />
      <DeleteTagModal />
      <CreateTagModal />
    </>
  )
}
