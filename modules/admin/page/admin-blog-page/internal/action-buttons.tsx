import { TagType } from '@prisma/client'
import { Edit2, Eye, Trash } from 'lucide-react'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useModalStore } from '@/store/use-modal-store'

export default function ActionButtons({
  blogId,
  slug,
  title,
}: {
  blogId: number
  slug: string
  title: string
}) {
  const { setModalOpen } = useModalStore()

  return (
    <section className="flex items-center gap-1">
      <Link
        href={`/blog/${slug}`}
        className={cn(buttonVariants({ variant: 'outline', className: 'size-8' }))}
      >
        <Eye className="size-4" />
      </Link>

      <Link
        href={`blog/edit/${slug}`}
        className={cn(buttonVariants({ variant: 'outline', className: 'size-8' }))}
      >
        <Edit2 className="size-4" />
      </Link>

      <Button
        variant="outline"
        className="size-8 text-red-600"
        onClick={() =>
          setModalOpen('deleteArticleModal', {
            id: blogId,
            title,
            articleType: TagType.BLOG,
          })
        }
      >
        <Trash className="size-4" />
      </Button>
    </section>
  )
}
