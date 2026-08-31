import { create } from 'zustand'

export type ModalType =
  | 'deleteArticleModal'
  | 'deleteMutterModal'
  | 'updateMutterModal'
  | 'editTagModal'
  | 'deleteTagModal'
  | 'createEchoModal'
  | 'deleteEchoModal'
  | 'editEchoModal'
  | 'createTagModal'
  | 'loginModal'
  | 'mutterCommentModal'
  | 'friendLinkApplyModal'
  | null

const useModalStore = create<{
  modalType: ModalType
  payload: unknown
  actions: {
    setModalOpen: <T = unknown>(modalType: ModalType, payload?: T) => void
    closeModal: () => void
  }
}>(set => ({
  modalType: null,
  payload: null,
  actions: {
    setModalOpen: <T = unknown>(modalType: ModalType, payload: T = {} as T) => {
      set({
        modalType,
        payload,
      })
    },
    closeModal: () => {
      set({ modalType: null, payload: null })
    },
  },
}))

export const useModalType = () => useModalStore(state => state.modalType)
export const useModalPayload = () => useModalStore(state => state.payload)
export const useModalActions = () => useModalStore(state => state.actions)
