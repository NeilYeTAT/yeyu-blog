'use client'

import CreateEchoModal from '@/ui/components/modal/create-echo-modal'
import CreateTagModal from '@/ui/components/modal/create-tag-modal'
import DeleteArticleModal from '@/ui/components/modal/delete-article-modal'
import DeleteEchoModal from '@/ui/components/modal/delete-echo-modal'
import DeleteTagModal from '@/ui/components/modal/delete-tag-modal'
import EditEchoModal from '@/ui/components/modal/edit-echo-modal'
import EditTagModal from '@/ui/components/modal/edit-tag-modal'

export function ModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <DeleteArticleModal />
      <EditTagModal />
      <DeleteTagModal />
      <CreateEchoModal />
      <DeleteEchoModal />
      <EditEchoModal />
      <CreateTagModal />
    </>
  )
}
