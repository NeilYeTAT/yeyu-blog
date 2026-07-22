import { type RefObject, useCallback, useEffect, useRef } from 'react'

export function useVisibilityAnimation({
  targetRef,
  keyframes,
  options,
  enabled = true,
}: {
  targetRef: RefObject<HTMLElement | null>
  keyframes: Keyframe[]
  options: KeyframeAnimationOptions
  enabled?: boolean
}) {
  const animationRef = useRef<Animation | null>(null)
  const isIntersectingRef = useRef(false)
  const isManuallyPausedRef = useRef(false)
  const shouldReduceMotionRef = useRef(false)
  const playbackRateRef = useRef(1)
  const playbackRateFrameRef = useRef<number | null>(null)

  const syncPlayback = useCallback(() => {
    const animation = animationRef.current
    if (animation === null) return

    const shouldPlay =
      enabled &&
      isIntersectingRef.current &&
      !isManuallyPausedRef.current &&
      !shouldReduceMotionRef.current &&
      document.visibilityState === 'visible'

    if (shouldPlay) animation.play()
    else animation.pause()
  }, [enabled])

  useEffect(() => {
    const target = targetRef.current
    if (target === null) return

    const animation = target.animate(keyframes, options)
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    animation.pause()
    animation.playbackRate = playbackRateRef.current
    animationRef.current = animation
    shouldReduceMotionRef.current = reducedMotionQuery.matches

    const observer = new IntersectionObserver(entries => {
      isIntersectingRef.current = entries[0]?.isIntersecting ?? false
      syncPlayback()
    })

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      shouldReduceMotionRef.current = event.matches
      syncPlayback()
    }

    observer.observe(target)
    document.addEventListener('visibilitychange', syncPlayback)
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', syncPlayback)
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange)
      if (playbackRateFrameRef.current !== null) {
        cancelAnimationFrame(playbackRateFrameRef.current)
        playbackRateFrameRef.current = null
      }
      animation.cancel()
      animationRef.current = null
    }
  }, [keyframes, options, syncPlayback, targetRef])

  const animatePlaybackRate = useCallback(
    (nextPlaybackRate: number, duration: number, onComplete?: () => void) => {
      if (playbackRateFrameRef.current !== null) {
        cancelAnimationFrame(playbackRateFrameRef.current)
      }

      const animation = animationRef.current
      if (animation === null) return

      const initialPlaybackRate = playbackRateRef.current
      const startTime = performance.now()

      const updatePlaybackRate = (time: number) => {
        const progress = Math.min((time - startTime) / duration, 1)
        const easedProgress = progress * progress * (3 - 2 * progress)
        const playbackRate =
          initialPlaybackRate + (nextPlaybackRate - initialPlaybackRate) * easedProgress

        playbackRateRef.current = playbackRate
        animation.updatePlaybackRate(playbackRate)

        if (progress < 1) {
          playbackRateFrameRef.current = requestAnimationFrame(updatePlaybackRate)
          return
        }

        playbackRateFrameRef.current = null
        onComplete?.()
      }

      playbackRateFrameRef.current = requestAnimationFrame(updatePlaybackRate)
    },
    [],
  )

  const pause = useCallback(
    (duration = 0) => {
      if (duration === 0) {
        isManuallyPausedRef.current = true
        syncPlayback()
        return
      }

      animatePlaybackRate(0, duration, () => {
        isManuallyPausedRef.current = true
        syncPlayback()
      })
    },
    [animatePlaybackRate, syncPlayback],
  )

  const play = useCallback(
    (duration = 0) => {
      isManuallyPausedRef.current = false

      if (duration === 0) {
        playbackRateRef.current = 1
        animationRef.current?.updatePlaybackRate(1)
        syncPlayback()
        return
      }

      if (animationRef.current !== null && playbackRateRef.current === 0) {
        animationRef.current.updatePlaybackRate(0.001)
      }
      syncPlayback()
      animatePlaybackRate(1, duration)
    },
    [animatePlaybackRate, syncPlayback],
  )

  return { pause, play }
}
