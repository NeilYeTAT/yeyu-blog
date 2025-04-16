import { cn } from '@/lib/utils'

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div className={cn('mx-auto max-w-3xl w-11/12', className)}>{children}</div>
  )
}

export default MaxWidthWrapper
