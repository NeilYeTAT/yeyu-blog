import { useEffect, useRef, useState } from 'react'

const defaultHideDistance = 32
const defaultShowDistance = 12
const defaultTopShowOffset = 24

export const useScrollVisibility = (
  options: { hideDistance?: number; showDistance?: number; topShowOffset?: number } = {},
) => {
  const {
    hideDistance = defaultHideDistance,
    showDistance = defaultShowDistance,
    topShowOffset = defaultTopShowOffset,
  } = options
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollYRef = useRef(0)
  const directionRef = useRef<-1 | 0 | 1>(0)
  const accumulatedDistanceRef = useRef(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    lastScrollYRef.current = window.scrollY
    directionRef.current = 0
    accumulatedDistanceRef.current = 0

    const updateVisibility = () => {
      frameRef.current = null

      const currentScrollY = Math.max(window.scrollY, 0)
      const delta = currentScrollY - lastScrollYRef.current

      if (currentScrollY <= topShowOffset) {
        setIsVisible(prev => (prev ? prev : true))
        directionRef.current = 0
        accumulatedDistanceRef.current = 0
        lastScrollYRef.current = currentScrollY
        return
      }

      if (Math.abs(delta) < 1) return

      lastScrollYRef.current = currentScrollY

      const direction = delta > 0 ? 1 : -1

      if (directionRef.current !== direction) {
        directionRef.current = direction
        accumulatedDistanceRef.current = Math.abs(delta)
      } else {
        accumulatedDistanceRef.current += Math.abs(delta)
      }

      if (direction > 0 && accumulatedDistanceRef.current >= hideDistance) {
        setIsVisible(prev => (prev ? false : prev))
        accumulatedDistanceRef.current = 0
        return
      }

      if (direction < 0 && accumulatedDistanceRef.current >= showDistance) {
        setIsVisible(prev => (prev ? prev : true))
        accumulatedDistanceRef.current = 0
      }
    }

    const handleScroll = () => {
      if (frameRef.current != null) return

      frameRef.current = window.requestAnimationFrame(updateVisibility)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)

      if (frameRef.current != null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [hideDistance, showDistance, topShowOffset])

  return isVisible
}
