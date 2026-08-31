'use client'

import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import { Modal } from '@/ui/components/interior/modal'
import { Button } from '@/ui/shadcn/button'

export function MainConfirmModal({
  contentClassName,
  titleClassName,
  descriptionClassName,
  footerClassName,
  cancelButtonClassName,
  confirmButtonClassName,
  cancelButtonVariant = 'outline',
  confirmButtonVariant = 'default',
  open,
  onClose,
  onConfirm,
  title,
  description,
  children,
  isPending = false,
  cancelText = '取消',
  confirmText = '确定',
  pendingText = '稍等',
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  isPending?: boolean
  contentClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  footerClassName?: string
  cancelButtonClassName?: string
  confirmButtonClassName?: string
  cancelButtonVariant?: ComponentProps<typeof Button>['variant']
  confirmButtonVariant?: ComponentProps<typeof Button>['variant']
  cancelText?: ReactNode
  confirmText?: ReactNode
  pendingText?: ReactNode
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button
            type="button"
            variant={cancelButtonVariant}
            onClick={onClose}
            disabled={isPending}
            className={cn(
              'h-10 cursor-pointer rounded-xl border-theme-border/70 bg-theme-surface/50 px-4 text-theme-primary shadow-none hover:border-theme-accent/40 hover:bg-theme-hover-background/70 hover:text-theme-primary focus-visible:ring-theme-ring/25 dark:border-white/10 dark:bg-zinc-900/35 dark:text-zinc-100 dark:hover:bg-zinc-800/70 dark:hover:text-white',
              cancelButtonClassName,
            )}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={confirmButtonVariant}
            onClick={() => {
              void onConfirm()
            }}
            disabled={isPending}
            className={cn(
              'h-10 cursor-pointer rounded-xl bg-theme-accent px-4 text-white shadow-[0_10px_24px_color-mix(in_srgb,var(--theme-accent)_26%,transparent)] hover:bg-[color-mix(in_srgb,var(--theme-accent)_92%,black)] hover:text-white focus-visible:ring-theme-ring/35 disabled:cursor-not-allowed disabled:bg-theme-accent disabled:text-white disabled:opacity-45',
              confirmButtonClassName,
            )}
          >
            {isPending ? pendingText : confirmText}
          </Button>
        </>
      }
      closeLabel="关闭确认弹窗"
      maxWidth={420}
      className={cn(
        'rounded-xl border-theme-border/70 bg-theme-background/85 text-theme-primary shadow-[0_18px_54px_color-mix(in_srgb,var(--theme-accent)_14%,transparent)] backdrop-blur-xl sm:max-w-[420px] dark:border-white/10 dark:bg-zinc-950/85 dark:text-zinc-100 dark:shadow-[0_18px_60px_rgba(0,0,0,0.38)]',
        contentClassName,
      )}
      titleClassName={cn('text-center font-bold text-theme-primary text-xl', titleClassName)}
      descriptionClassName={cn(
        'text-center text-zinc-600 dark:text-zinc-400',
        descriptionClassName,
      )}
      footerClassName={cn('gap-2 sm:gap-3', footerClassName)}
    >
      {children}
    </Modal>
  )
}
