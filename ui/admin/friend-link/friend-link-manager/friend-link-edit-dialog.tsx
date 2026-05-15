import type { FormEvent } from 'react'
import type { AdminFriendLinkRecord } from '@/lib/api/friend-link'
import type { FriendLinkEditForm } from './types'
import { Button } from '@/ui/shadcn/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { friendLinkEditFields } from './constants'

export function FriendLinkEditDialog({
  editForm,
  editingFriendLink,
  isUpdatingFriendLink,
  onClose,
  onEditFormValueChange,
  onSubmit,
}: {
  editForm: FriendLinkEditForm
  editingFriendLink: AdminFriendLinkRecord | null
  isUpdatingFriendLink: boolean
  onClose: () => void
  onEditFormValueChange: (name: keyof FriendLinkEditForm, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <Dialog
      open={editingFriendLink != null}
      onOpenChange={open => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>修改友链信息</DialogTitle>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={onSubmit}>
          {friendLinkEditFields.map(field => {
            const fieldId = `friend-link-edit-${field.name}`

            return (
              <div key={field.name} className="grid gap-2">
                <Label htmlFor={fieldId}>{field.label}</Label>
                <Input
                  id={fieldId}
                  type={field.type}
                  required
                  value={editForm[field.name]}
                  onChange={event => {
                    onEditFormValueChange(field.name, event.target.value)
                  }}
                />
              </div>
            )
          })}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              disabled={isUpdatingFriendLink}
              onClick={onClose}
            >
              取消
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={isUpdatingFriendLink}>
              {isUpdatingFriendLink ? '保存中...' : '保存修改'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
