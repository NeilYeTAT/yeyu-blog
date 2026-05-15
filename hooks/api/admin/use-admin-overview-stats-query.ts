import { useQuery } from '@tanstack/react-query'
import { getAdminOverviewStats } from '@/lib/api/admin'

const adminOverviewStatsQueryKey = ['admin-overview-stats'] as const

export function useAdminOverviewStatsQuery() {
  return useQuery({
    queryKey: adminOverviewStatsQueryKey,
    queryFn: getAdminOverviewStats,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    throwOnError: true,
  })
}
