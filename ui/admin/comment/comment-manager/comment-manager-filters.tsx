import type { CommentStateFilter, CommentTargetTypeFilter } from './types'
import { Search } from 'lucide-react'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/shadcn/select'
import { commentStateOptions, targetTypeOptions } from './constants'

export function CommentManagerFilters({
  draftQuery,
  draftState,
  draftTargetId,
  draftTargetType,
  onApplyFilters,
  onDraftQueryChange,
  onDraftStateChange,
  onDraftTargetIdChange,
  onDraftTargetTypeChange,
}: {
  draftQuery: string
  draftState: CommentStateFilter
  draftTargetId: string
  draftTargetType: CommentTargetTypeFilter
  onApplyFilters: () => void
  onDraftQueryChange: (value: string) => void
  onDraftStateChange: (value: CommentStateFilter) => void
  onDraftTargetIdChange: (value: string) => void
  onDraftTargetTypeChange: (value: CommentTargetTypeFilter) => void
}) {
  return (
    <header className="flex flex-wrap items-center gap-2">
      <Input
        className="min-w-56 flex-1"
        placeholder="搜索评论内容..."
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
      <Input
        className="w-40"
        placeholder="文章 ID"
        value={draftTargetId}
        onChange={event => {
          onDraftTargetIdChange(event.target.value)
        }}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            onApplyFilters()
          }
        }}
      />
      <Select
        value={draftTargetType}
        onValueChange={value => {
          onDraftTargetTypeChange(value as CommentTargetTypeFilter)
        }}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="内容类型" />
        </SelectTrigger>
        <SelectContent>
          {targetTypeOptions.map(option => (
            <SelectItem value={option.value} key={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={draftState}
        onValueChange={value => {
          onDraftStateChange(value as CommentStateFilter)
        }}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="评论状态" />
        </SelectTrigger>
        <SelectContent>
          {commentStateOptions.map(option => (
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
