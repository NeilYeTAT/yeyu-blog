'use client'

import { useState } from 'react'
import {
  type BrandThemeId,
  brandThemeOptions,
  resolveBrandTheme,
  setBrandTheme,
} from '@/lib/styles/themes/constant'
import { useModalActions, useModalType } from '@/store/use-modal-store'
import { Modal } from '@/ui/components/interior/modal'

export const SelectThemeModal = () => {
  const modalType = useModalType()
  const { closeModal } = useModalActions()
  const isModalOpen = modalType === 'selectThemeModal'
  const [activeTheme, setActiveTheme] = useState<BrandThemeId>(resolveBrandTheme)

  return (
    <Modal
      open={isModalOpen}
      onClose={closeModal}
      title="切换主题"
      closeLabel="关闭主题弹窗"
      maxWidth={384}
      className="border-theme-border/70 bg-theme-background/80 text-foreground backdrop-blur-xl dark:border-theme-dark-border/20 dark:bg-black/70"
      titleClassName="font-bold text-xl text-foreground"
    >
      <div className="flex flex-col items-center gap-3 pb-1 text-base">
        {brandThemeOptions.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className="cursor-pointer text-center transition-opacity hover:opacity-70"
            onClick={() => {
              setBrandTheme(id)
              setActiveTheme(id)
              closeModal()
            }}
          >
            <span className={activeTheme === id ? 'text-theme-accent' : undefined}>{label}</span>
          </button>
        ))}
      </div>
    </Modal>
  )
}
