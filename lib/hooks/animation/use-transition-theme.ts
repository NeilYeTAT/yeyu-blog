import { useTheme } from 'next-themes'
import { useCallback } from 'react'

type Direction = 'left' | 'right' | 'center' | 'top' | 'bottom'

function getClipPathDirection(direction: Direction) {
  switch (direction) {
    case 'center':
      return [
        'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
        'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      ]
    case 'left':
      return [`inset(0 0 0 100%)`, `inset(0 0 0 0)`]
    case 'right':
      return [`inset(0 100% 0 0)`, `inset(0 0% 0 0)`]
    case 'top':
      return [`inset(100% 0 0 0)`, `inset(0% 0 0 0)`]
    case 'bottom':
      return [`inset(0 0 100% 0)`, `inset(0 0 0% 0)`]
  }
}

export function useTransitionTheme() {
  const { setTheme, theme, themes, forcedTheme, resolvedTheme, systemTheme } = useTheme()

  const setTransitionTheme = useCallback(
    (t: 'light' | 'dark', direction: Direction = 'center') => {
      if (theme === t) return
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (document.startViewTransition) {
        const transition = document.startViewTransition(() => {
          setTheme(t)
        })
        transition.ready.then(() => {
          const clipPath = getClipPathDirection(direction)
          document.documentElement.animate(
            {
              clipPath,
            },
            {
              duration: 450,
              pseudoElement: '::view-transition-new(root)',
              easing: 'ease-in-out',
            },
          )
        })
      } else {
        setTheme(t)
      }
    },
    [setTheme, theme],
  )

  return {
    setTransitionTheme,
    theme,
    themes,
    forcedTheme,
    resolvedTheme,
    systemTheme,
  }
}
