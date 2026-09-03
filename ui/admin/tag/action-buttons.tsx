import { Edit2, Trash } from 'lucide-react'
import { useModalActions } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'

export default function ActionButtons({ id, tagName }: { id: number; tagName: string }) {
  const { setModalOpen } = useModalActions()

  return (
    <section className="flex items-center gap-1">
      <Button
        variant="outline"
        className="size-8 cursor-pointer"
        onClick={() =>
          setModalOpen('editTagModal', {
            id,
            tagName,
          })
        }
      >
        <Edit2 className="size-4" />
      </Button>

      <Button
        variant="outline"
        className="size-8 text-red-600"
        onClick={() => {
          setModalOpen('deleteTagModal', {
            id,
            tagName,
          })
        }}
      >
        <Trash />
      </Button>
    </section>
  )
}
