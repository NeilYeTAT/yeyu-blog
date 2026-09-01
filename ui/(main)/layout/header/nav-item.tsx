import type { NavRoute } from './types'
import { type ComponentProps, type FC, startTransition } from 'react'
import { sileo } from 'sileo'
import { useModalActions } from '@/store/use-modal-store'
import { useLanguage } from '@/ui/components/provider/main/language-provider'
import { WaveLink } from '@/ui/components/shared/wave-link'

export const NavItem: FC<
  {
    item: NavRoute
    elRef?: React.Ref<HTMLAnchorElement | HTMLButtonElement>
    onButtonClick?: () => void
  } & Omit<ComponentProps<'a'>, 'href' | 'ref'>
> = ({ item, className, children, elRef, onButtonClick, ...props }) => {
  const isButton = item.type === 'button'
  const { setModalOpen } = useModalActions()
  const { language } = useLanguage()

  if (isButton) {
    return (
      <button
        ref={elRef as React.Ref<HTMLButtonElement>}
        className={className}
        type="button"
        aria-label={props['aria-label']}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (item.disabled === true) {
            e.preventDefault()

            sileo.info({
              title: 'Coming soon...',
              description: 'One day...',
            })
            return
          }
          const modalType = item.modal

          if (modalType != null) {
            startTransition(() => {
              setModalOpen(modalType)
            })
          }

          onButtonClick?.()
        }}
      >
        {children}
      </button>
    )
  }

  return (
    <WaveLink
      ref={elRef as React.Ref<HTMLAnchorElement>}
      href={`/${language}${item.path}`}
      className={className}
      withWaveUnderline={false}
      {...props}
      onClick={e => {
        if (item.disabled === true) {
          e.preventDefault()
          sileo.info({
            title: 'Coming soon...',
            description: 'One day...',
          })
          return
        }
      }}
    >
      {children}
    </WaveLink>
  )
}
