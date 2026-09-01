import { notFound } from 'next/navigation'
import { isLanguage } from './config'

export function getRouteLanguage(value: string) {
  if (!isLanguage(value)) {
    notFound()
  }

  return value
}
