import { useEffect, useRef, useState } from 'react'
import { subscribeScrollContainer } from '@/lib/utils/common/scroll-container-store'

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

  useEffect(() => {
    const scrollTarget = document.querySelector<HTMLElement>('[data-main-scroll-container]')

    if (scrollTarget === null) return

    lastScrollYRef.current = Math.max(scrollTarget.scrollTop, 0)
    directionRef.current = 0
    accumulatedDistanceRef.current = 0

    return subscribeScrollContainer(scrollTarget, ({ scrollTop: currentScrollY }) => {
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
    })
  }, [hideDistance, showDistance, topShowOffset])

  return isVisible
}
