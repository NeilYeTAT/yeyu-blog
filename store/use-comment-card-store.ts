import { create } from 'zustand'

type CommentCardStore = {
  activeReplyCommentId: number | null
  replyContent: string
  deletingCommentId: number | null
  actions: {
    setReplyContent: (content: string) => void
    toggleReply: (commentId: number) => void
    clearReply: () => void
    setDeletingCommentId: (commentId: number | null) => void
    reset: () => void
  }
}

const initialCommentCardState = {
  activeReplyCommentId: null,
  replyContent: '',
  deletingCommentId: null,
} satisfies Omit<CommentCardStore, 'actions'>

export const useCommentCardStore = create<CommentCardStore>(set => ({
  ...initialCommentCardState,
  actions: {
    setReplyContent: replyContent => {
      set({ replyContent })
    },
    toggleReply: commentId => {
      set(state => ({
        activeReplyCommentId: state.activeReplyCommentId === commentId ? null : commentId,
        replyContent: '',
      }))
    },
    clearReply: () => {
      set({ activeReplyCommentId: null, replyContent: '' })
    },
    setDeletingCommentId: deletingCommentId => {
      set({ deletingCommentId })
    },
    reset: () => {
      set(initialCommentCardState)
    },
  },
}))

export const useCommentCardActions = () => useCommentCardStore(state => state.actions)
