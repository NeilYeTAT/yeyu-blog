import type { ModalType } from '@/store/use-modal-store'

export type NavRoute = {
  path: string
  pathName: string
  pattern: RegExp
  disabled?: boolean
  type?: 'link' | 'button'
  modal?: ModalType
}
