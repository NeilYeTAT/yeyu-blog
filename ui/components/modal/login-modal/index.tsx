import type { ComponentProps, FC } from 'react'
import { signIn } from '@/lib/auth/client'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { GitHubIcon } from './github-icon'

export const LoginModal: FC<ComponentProps<'div'>> = () => {
  const { modalType, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'loginModal'

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="bg-clear-sky-background/80 rounded-xl backdrop-blur-xl sm:max-w-90 dark:bg-black/70">
        <DialogHeader className="">
          <DialogTitle className="text-center text-xl font-bold">登录 (ゝ∀･)</DialogTitle>
        </DialogHeader>

        <main className="">
          <Button
            type="button"
            onClick={() => signIn.social({ provider: 'github', callbackURL: '/admin' })}
            className="w-full cursor-pointer text-base font-bold"
            size={'icon'}
          >
            <GitHubIcon className="size-5" />
            GitHub
          </Button>
        </main>
      </DialogContent>
    </Dialog>
  )
}
