'use client'

import { LoginModal } from '../modal/login-modal'

export function MainModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <LoginModal />
    </>
  )
}
