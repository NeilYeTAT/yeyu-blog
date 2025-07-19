'use client'

import CreateEchoModal from '@/components/modal/create-echo-modal'
import CreateTagModal from '@/components/modal/create-tag-modal'
import DeleteArticleModal from '@/components/modal/delete-article-modal'
import DeleteEchoModal from '@/components/modal/delete-echo-modal'
import DeleteTagModal from '@/components/modal/delete-tag-modal'
import EditEchoModal from '@/components/modal/edit-echo-modal'
import EditTagModal from '@/components/modal/edit-tag-modal'

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
