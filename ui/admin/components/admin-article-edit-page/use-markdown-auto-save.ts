import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

const autoSavePrefix = 'admin-article-markdown-draft-v1'
const autoSaveDelayMs = 800
const maxDraftAgeMs = 1000 * 60 * 60 * 24 * 7

type DraftPayload = {
  content: string
  updatedAt: number
}

export function useMarkdownAutoSave(value: string) {
  const pathname = usePathname()
  const latestValueRef = useRef(value)
  const restoredDraftKeyRef = useRef<string | null>(null)
  const [restoredDraft, setRestoredDraft] = useState<{
    content: string
    storageKey: string
  } | null>(null)
  const storageKey = `${autoSavePrefix}:${pathname}`

  const saveDraft = useCallback(
    (content: string) => {
      if (content.trim().length === 0) {
        localStorage.removeItem(storageKey)
        return
      }

      const payload: DraftPayload = {
        content,
        updatedAt: Date.now(),
      }
      localStorage.setItem(storageKey, JSON.stringify(payload))
    },
    [storageKey],
  )

  useEffect(() => {
    latestValueRef.current = value
  }, [value])

  useEffect(() => {
    if (restoredDraftKeyRef.current === storageKey) return
    restoredDraftKeyRef.current = storageKey

    const rawDraft = localStorage.getItem(storageKey)
    if (rawDraft == null) return

    try {
      const payload = JSON.parse(rawDraft) as DraftPayload
      if (
        typeof payload.content !== 'string' ||
        typeof payload.updatedAt !== 'number' ||
        Date.now() - payload.updatedAt > maxDraftAgeMs
      ) {
        localStorage.removeItem(storageKey)
        return
      }

      if (payload.content !== latestValueRef.current) {
        setRestoredDraft({ content: payload.content, storageKey })
      }
    } catch {
      localStorage.removeItem(storageKey)
    }
  }, [storageKey])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveDraft(value)
    }, autoSaveDelayMs)

    return () => {
      window.clearTimeout(timer)
    }
  }, [saveDraft, value])

  useEffect(() => {
    const persistDraftNow = () => {
      saveDraft(latestValueRef.current)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        persistDraftNow()
      }
    }

    window.addEventListener('pagehide', persistDraftNow)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('pagehide', persistDraftNow)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [saveDraft])

  return restoredDraft?.storageKey === storageKey ? restoredDraft.content : null
}
