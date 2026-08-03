import Link from 'next/link'
import { useRef } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import { useModalActions } from '@/store/use-modal-store'
import { buttonVariants } from '@/ui/shadcn/button'
import { LayoutGridIcon, type LayoutGridIconHandle } from '@/ui/shadcn/layout-grid'

export function AdminDashboardLink() {
  const { closeModal } = useModalActions()
  const iconRef = useRef<LayoutGridIconHandle>(null)

  return (
    <Link
      href="/admin"
      onClick={closeModal}
      className={cn(
        buttonVariants(),
        'h-10 w-full cursor-pointer rounded-xl bg-theme-primary px-4 text-white shadow-none hover:bg-theme-primary/90 hover:text-white hover:shadow-none focus-visible:border-theme-ring focus-visible:ring-theme-ring/35',
      )}
      onMouseEnter={() => {
        iconRef.current?.startAnimation()
      }}
      onMouseLeave={() => {
        iconRef.current?.stopAnimation()
      }}
    >
      <LayoutGridIcon ref={iconRef} className="size-4" size={16} />
      进入后台
    </Link>
  )
}
