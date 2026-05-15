import type { FriendLinkStateFilter } from './types'
import { Search } from 'lucide-react'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/shadcn/select'
import { friendLinkStateOptions } from './constants'

export function FriendLinkFilters({
  draftQuery,
  draftState,
  onApplyFilters,
  onDraftQueryChange,
  onDraftStateChange,
}: {
  draftQuery: string
  draftState: FriendLinkStateFilter
  onApplyFilters: () => void
  onDraftQueryChange: (value: string) => void
  onDraftStateChange: (value: FriendLinkStateFilter) => void
}) {
  return (
    <header className="flex flex-wrap items-center gap-2">
      <Input
        className="min-w-56 flex-1"
        placeholder="搜索站点、邮箱、描述或地址..."
        value={draftQuery}
        onChange={event => {
          onDraftQueryChange(event.target.value)
        }}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            onApplyFilters()
          }
        }}
      />
      <Select
        value={draftState}
        onValueChange={value => {
          onDraftStateChange(value as FriendLinkStateFilter)
        }}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="友链状态" />
        </SelectTrigger>
        <SelectContent>
          {friendLinkStateOptions.map(option => (
            <SelectItem value={option.value} key={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="button" variant="secondary" className="cursor-pointer" onClick={onApplyFilters}>
        <Search className="size-4" />
        搜索
      </Button>
    </header>
  )
}
