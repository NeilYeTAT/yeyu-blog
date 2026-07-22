'use client'

import DeleteArticleModal from '@/ui/components/modal/admin/article/delete-article-modal'
import CreateEchoModal from '@/ui/components/modal/admin/echo/create-echo-modal'
import DeleteEchoModal from '@/ui/components/modal/admin/echo/delete-echo-modal'
import EditEchoModal from '@/ui/components/modal/admin/echo/edit-echo-modal'
import DeleteMutterModal from '@/ui/components/modal/admin/mutter/delete-mutter-modal'
import UpdateMutterModal from '@/ui/components/modal/admin/mutter/update-mutter-modal'
import CreateTagModal from '@/ui/components/modal/admin/tag/create-tag-modal'
import DeleteTagModal from '@/ui/components/modal/admin/tag/delete-tag-modal'
import EditTagModal from '@/ui/components/modal/admin/tag/edit-tag-modal'

export function AdminModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <DeleteArticleModal />
      <DeleteMutterModal />
      <UpdateMutterModal />
      <EditTagModal />
      <DeleteTagModal />
      <CreateEchoModal />
      <DeleteEchoModal />
      <EditEchoModal />
      <CreateTagModal />
    </>
  )
}
