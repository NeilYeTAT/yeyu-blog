const shanghai = 'Asia/Shanghai'
const minuteMs = 60 * 1000
const hourMs = 60 * minuteMs
const dayMs = 24 * hourMs
const weekMs = 7 * dayMs

const shanghaiDatePartsFormatter = new Intl.DateTimeFormat('en-US-u-nu-latn', {
  timeZone: shanghai,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hourCycle: 'h23',
})

const displayDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: shanghai,
  year: 'numeric',
  month: 'short',
  day: '2-digit',
})

const getShanghaiDateParts = (
  date: number | Date,
): {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
} => {
  const values: Record<string, number> = {}

  for (const part of shanghaiDatePartsFormatter.formatToParts(new Date(date))) {
    if (part.type !== 'literal') {
      values[part.type] = Number(part.value)
    }
  }

  return values as {
    year: number
    month: number
    day: number
    hour: number
    minute: number
    second: number
  }
}

const getDayOfYear = (year: number, month: number, day: number) =>
  Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 1)) / dayMs) + 1

export function prettyDateTime(date: number | Date) {
  const { year, month, day, hour, minute } = getShanghaiDateParts(date)
  const twoDigitYear = String(year % 100).padStart(2, '0')

  return `${twoDigitYear}年${month}月${day}日 ${hour}时 ${minute}分`
}

export function toRelativeDate(date: number | Date) {
  const target = new Date(date)
  const diff = Date.now() - target.getTime()

  if (diff <= 0) return '刚刚'

  if (diff < hourMs) {
    return `${Math.max(1, Math.floor(diff / minuteMs))} 分钟前`
  }

  if (diff < dayMs) {
    return `${Math.floor(diff / hourMs)} 小时前`
  }

  if (diff <= weekMs) {
    return `${Math.floor(diff / dayMs)} 天前`
  }

  const { year, month, day } = getShanghaiDateParts(target)
  return `${year}年${month}月${day}日`
}

export function toDisplayDate(date: number | Date) {
  return displayDateFormatter.format(new Date(date))
}

export function getRemainingDaysOfYear(): number {
  const { year, month, day } = getShanghaiDateParts(Date.now())
  const daysInYear = (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / dayMs

  return daysInYear - getDayOfYear(year, month, day)
}

export function getYearProgress(): { passed: number; remaining: number } {
  const now = new Date()
  const { year, month, day, hour, minute, second } = getShanghaiDateParts(now)
  const startOfYear = Date.UTC(year, 0, 1)
  const endOfYear = Date.UTC(year + 1, 0, 1) - 1
  const currentTime = Date.UTC(year, month - 1, day, hour, minute, second) + now.getMilliseconds()
  const totalMs = endOfYear - startOfYear
  const passedMs = currentTime - startOfYear

  const passedPercentage = (passedMs / totalMs) * 100
  const remainingPercentage = 100 - passedPercentage

  return {
    passed: Number(passedPercentage.toFixed(2)),
    remaining: Number(remainingPercentage.toFixed(2)),
  }
}

export function getTodayDayInfo(): { year: number; dayOfYear: number } {
  const { year, month, day } = getShanghaiDateParts(Date.now())

  return {
    year,
    dayOfYear: getDayOfYear(year, month, day),
  }
}
