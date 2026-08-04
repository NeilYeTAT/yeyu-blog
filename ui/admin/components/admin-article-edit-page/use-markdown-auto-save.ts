import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const autoSavePrefix = 'admin-article-markdown-draft-v1'
const autoSaveDelayMs = 800
const maxDraftAgeMs = 1000 * 60 * 60 * 24 * 7

function readLegacyDraft(rawDraft: string) {
  const match = rawDraft.match(
    /^\{"content":("(?:\\(?:["\\/bfnrt]|u[\da-fA-F]{4})|[^"\\])*"),"updatedAt":(\d+)\}$/,
  )
  if (match == null) return null

  const serializedContent = match[1]
  for (const character of serializedContent) {
    if (character.charCodeAt(0) < 32) return null
  }

  return {
    content: JSON.parse(serializedContent) as string,
    updatedAt: Number(match[2]),
  }
}

function readDraft(storageKey: string, currentValue: string) {
  if (typeof window === 'undefined') return null

  const storedContent = localStorage.getItem(storageKey)
  const storedUpdatedAt = localStorage.getItem(`${storageKey}:updated-at`)
  const legacyDraft =
    storedContent == null || storedUpdatedAt != null ? null : readLegacyDraft(storedContent)
  const content = legacyDraft == null ? storedContent : legacyDraft.content
  const updatedAt = legacyDraft == null ? Number(storedUpdatedAt) : legacyDraft.updatedAt

  if (
    content == null ||
    !Number.isFinite(updatedAt) ||
    Date.now() - updatedAt > maxDraftAgeMs ||
    content === currentValue
  ) {
    return null
  }

  return content
}

function saveDraft(storageKey: string, content: string) {
  if (content.trim().length === 0) {
    localStorage.removeItem(storageKey)
    localStorage.removeItem(`${storageKey}:updated-at`)
    return
  }

  localStorage.setItem(storageKey, content)
  localStorage.setItem(`${storageKey}:updated-at`, String(Date.now()))
}

export function useMarkdownAutoSave(value: string) {
  const pathname = usePathname()
  const latestValueRef = useRef(value)
  const storageKey = `${autoSavePrefix}:${pathname}`
  const [restoredDraft, setRestoredDraft] = useState(() => ({
    content: readDraft(storageKey, value),
    storageKey,
  }))

  if (restoredDraft.storageKey !== storageKey) {
    setRestoredDraft({
      content: readDraft(storageKey, value),
      storageKey,
    })
  }

  useEffect(() => {
    latestValueRef.current = value
  }, [value])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveDraft(storageKey, value)
    }, autoSaveDelayMs)

    return () => {
      window.clearTimeout(timer)
    }
  }, [storageKey, value])

  useEffect(() => {
    const persistDraftNow = () => {
      saveDraft(storageKey, latestValueRef.current)
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
  }, [storageKey])

  return restoredDraft.storageKey === storageKey ? restoredDraft.content : null
}
