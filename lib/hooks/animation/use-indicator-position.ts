import { useEffect, useRef, useState } from 'react'

export function useIndicatorPosition(
  activeUrl: string,
  refs: React.MutableRefObject<Map<string, HTMLAnchorElement>>,
) {
  const [style, setStyle] = useState({ left: 0, width: 0 })
  const observerRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    const el = refs.current.get(activeUrl)
    if (el == null) return

    const update = () => {
      setStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
      })
    }

    update()

    observerRef.current = new ResizeObserver(update)
    observerRef.current.observe(el)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [activeUrl, refs])

  return style
}
