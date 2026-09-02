'use client'

import type { ComponentProps } from 'react'
import { useTranslations } from '@/ui/components/provider/main/language-provider'

export function MainEmptyState(props: Omit<ComponentProps<'p'>, 'children'>) {
  const translations = useTranslations()

  return <p {...props}>{translations.common.empty}</p>
}
