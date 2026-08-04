'use client'

import type {
  CellContext,
  ColumnDef,
  HeaderContext,
  OnChangeFn,
  PaginationState,
} from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/shadcn/table'
import { DataTablePagination } from './data-table-pagination'

const emptyData: never[] = []

function getColumnId<TData, TValue>(column: ColumnDef<TData, TValue>, index: number) {
  if ('id' in column && typeof column.id === 'string') return column.id
  if ('accessorKey' in column) return String(column.accessorKey)
  return String(index)
}

function getCellValue<TData, TValue>(
  column: ColumnDef<TData, TValue>,
  row: TData,
  rowIndex: number,
) {
  if ('accessorFn' in column && typeof column.accessorFn === 'function') {
    return column.accessorFn(row, rowIndex)
  }

  if (!('accessorKey' in column)) return undefined

  return (row as Record<string, unknown>)[String(column.accessorKey)]
}

function compareValues(left: unknown, right: unknown) {
  if (left == null && right == null) return 0
  if (left == null) return -1
  if (right == null) return 1
  if (left instanceof Date && right instanceof Date) return left.getTime() - right.getTime()
  if (typeof left === 'number' && typeof right === 'number') return left - right

  return String(left).localeCompare(String(right), 'zh-CN', { numeric: true })
}

export function DataTable<TData, TValue>({
  columns,
  data = emptyData,
  onPaginationChange,
  pageCount,
  pagination: controlledPagination,
}: {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onPaginationChange?: OnChangeFn<PaginationState>
  pageCount?: number
  pagination?: PaginationState
}) {
  const [internalPagination, setInternalPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  })
  const tablePagination = controlledPagination ?? internalPagination
  const isManualPagination = controlledPagination != null && onPaginationChange != null
  const [sorting, setSorting] = useState<{ desc: boolean; id: string } | null>(null)
  const sortedData = sorting
    ? [...data].sort((left, right) => {
        const columnIndex = columns.findIndex(
          (column, index) => getColumnId(column, index) === sorting.id,
        )
        const column = columns[columnIndex]
        if (column == null) return 0

        const result = compareValues(getCellValue(column, left, 0), getCellValue(column, right, 0))
        return sorting.desc ? -result : result
      })
    : data
  const resolvedPageCount = Math.max(
    isManualPagination ? (pageCount ?? 0) : Math.ceil(sortedData.length / tablePagination.pageSize),
    1,
  )
  const resolvedPageIndex = Math.min(tablePagination.pageIndex, resolvedPageCount - 1)
  const rows = isManualPagination
    ? sortedData
    : sortedData.slice(
        resolvedPageIndex * tablePagination.pageSize,
        (resolvedPageIndex + 1) * tablePagination.pageSize,
      )

  const updatePagination = (updater: Parameters<OnChangeFn<PaginationState>>[0]) => {
    if (onPaginationChange == null) {
      setInternalPagination(updater)
      return
    }

    onPaginationChange(updater)
  }

  const updatePageIndex = (nextPageIndex: number) => {
    updatePagination(previous => ({
      ...previous,
      pageIndex: Math.min(Math.max(nextPageIndex, 0), resolvedPageCount - 1),
    }))
  }

  return (
    <motion.div
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border bg-zinc-50/70 dark:bg-zinc-950/50"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
      }}
    >
      <div className="min-h-0 min-w-0 flex-1 overflow-auto [scrollbar-color:rgba(113,113,122,0.45)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500/45 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-400/35 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-[3px]">
        <Table containerClassName="overflow-visible">
          <TableHeader className="bg-zinc-100 dark:bg-card">
            <TableRow>
              {columns.map((column, index) => {
                const columnId = getColumnId(column, index)
                const headerContext = {
                  column: {
                    getIsSorted: () =>
                      sorting?.id === columnId ? (sorting.desc ? 'desc' : 'asc') : false,
                    toggleSorting: (desc?: boolean) => {
                      setSorting({
                        desc: desc ?? sorting?.id === columnId,
                        id: columnId,
                      })
                      updatePageIndex(0)
                    },
                  },
                } as HeaderContext<TData, TValue>

                return (
                  <TableHead
                    key={columnId}
                    className="sticky top-0 z-20 bg-zinc-100 text-zinc-500 shadow-[0_1px_0_var(--border)] dark:bg-card dark:text-zinc-200"
                  >
                    {flexRender(column.header, headerContext)}
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>

          {/* 后序再骨架屏效果 */}
          {/* 11 个月前说要做骨架屏效果🤣 */}
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => {
                const rowId =
                  typeof row === 'object' &&
                  row != null &&
                  'id' in row &&
                  (typeof row.id === 'string' || typeof row.id === 'number')
                    ? String(row.id)
                    : String(rowIndex)

                return (
                  <TableRow key={rowId}>
                    {columns.map((column, columnIndex) => {
                      const columnId = getColumnId(column, columnIndex)
                      const cellContext = {
                        row: { original: row },
                      } as CellContext<TData, TValue>

                      return (
                        <TableCell key={`${rowId}-${columnId}`}>
                          {flexRender(column.cell, cellContext)}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  虚无。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        pageCount={resolvedPageCount}
        pageIndex={resolvedPageIndex}
        pageSize={tablePagination.pageSize}
        onPageIndexChange={updatePageIndex}
        onPageSizeChange={nextPageSize => {
          updatePagination(previous => ({
            ...previous,
            pageIndex: 0,
            pageSize: nextPageSize,
          }))
        }}
      />
    </motion.div>
  )
}
