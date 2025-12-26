import { cn } from '@/lib/utils/common/shadcn'

function MaxWidthWrapper({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn('mx-auto w-11/12 max-w-3xl', className)}>{children}</div>
}

export default MaxWidthWrapper
