import { useCallback, useState } from 'react'
import { toast } from 'sonner'

export function useQueryLoader<T>(
  getAll: () => Promise<T[]>,
  getQuery: (q: string) => Promise<T[]>,
  setData: (data: T[]) => void,
) {
  const [query, setQuery] = useState('')

  const load = useCallback(
    async (fetchFn: () => Promise<T[]>, resetQuery = false) => {
      try {
        const data = await fetchFn()
        if (resetQuery) setQuery('')
        setData(data)
      } catch {
        toast.error(resetQuery ? '重新加载出错' : '获取数据错误')
      }
    },
    [setData],
  )

  const fetchData = useCallback(() => {
    if (query.trim().length === 0) {
      load(getAll, true)
    } else {
      load(() => getQuery(query))
    }
  }, [query, getAll, getQuery, load])

  const resetData = useCallback(() => load(getAll, true), [getAll, load])

  return { query, setQuery, fetchData, resetData }
}
