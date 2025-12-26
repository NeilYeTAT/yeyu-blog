import { cn } from '@/lib/utils/common/shadcn'
import { Skeleton } from '@/ui/shadcn/skeleton'
import { toggleVariants } from '@/ui/shadcn/toggle'

export default function TagContainerSkeleton() {
  return (
    <>
      {Array.from({ length: 15 }).map((_, i) => (
        <Skeleton
          className={cn(toggleVariants({ variant: 'outline', size: 'sm' }), 'mr-4')}
          key={`${i.toString()}`}
        >
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        </Skeleton>
      ))}
    </>
  )
}
