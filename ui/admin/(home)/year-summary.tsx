import type { FC } from 'react'
import { getRemainingDaysOfYear, getYearProgress } from '@/lib/utils/time'

export const YearSummary: FC<{ year: number; dayOfYear: number }> = ({ year, dayOfYear }) => (
  <section className="text-center text-lg">
    <h2 className="font-semibold">
      今天是 <span className="text-theme-400">{year}</span> 的第{' '}
      <span className="text-theme-500">{dayOfYear}</span> 天
    </h2>
    <p>
      今年已经过去了 <span className="font-bold text-pink-400">{getYearProgress().passed}%</span>{' '}
      距离今年结束还有 <span className="font-bold text-pink-400">{getRemainingDaysOfYear()}</span>{' '}
      天
    </p>
  </section>
)
