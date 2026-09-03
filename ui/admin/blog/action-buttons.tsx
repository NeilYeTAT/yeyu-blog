import { Edit2, Eye, Trash } from 'lucide-react'
import Link from 'next/link'
import { defaultLanguage } from '@/lib/i18n/config'
import { cn } from '@/lib/utils/common/shadcn'
import { useModalActions } from '@/store/use-modal-store'
import { Button, buttonVariants } from '@/ui/shadcn/button'

export default function ActionButtons({
  blogId,
  slug,
  title,
}: {
  blogId: number
  slug: string
  title: string
}) {
  const { setModalOpen } = useModalActions()

  return (
    <section className="flex items-center gap-1">
      <Link
        href={`/${defaultLanguage}/blog/${slug}`}
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
          })
        }
      >
        <Trash className="size-4" />
      </Button>
    </section>
  )
}
