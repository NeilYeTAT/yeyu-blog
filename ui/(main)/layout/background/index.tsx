'use client'

import type { CSSProperties, FC } from 'react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  useCloudSpeed,
  useIsCloudAnimationRunning,
  useIsSkyBackgroundInitialized,
  useSkyBackgroundTimeState,
} from '@/store/use-sky-background-store'
import './background.css'
import { skyCloudLayers } from './sky-background-config'

const cloudLoadDelayMilliseconds = 2_000
const mobileCloudLayerCount = 2

export const Background: FC = () => {
  const cloudSpeed = useCloudSpeed()
  const isCloudAnimationRunning = useIsCloudAnimationRunning()
  const isInitialized = useIsSkyBackgroundInitialized()
  const [isPageVisible, setIsPageVisible] = useState(true)
  const [loadedCloudLayerCount, setLoadedCloudLayerCount] = useState(0)
  const { timeState } = useSkyBackgroundTimeState()
  const cloudDurations = skyCloudLayers.map(layer => layer.duration / cloudSpeed)
  const backgroundStyle = {
    '--site-sky-cloud-1-duration': `${cloudDurations[0]}s`,
    '--site-sky-cloud-2-duration': `${cloudDurations[1]}s`,
    '--site-sky-cloud-3-duration': `${cloudDurations[2]}s`,
    '--site-sky-cloud-4-duration': `${cloudDurations[3]}s`,
    '--site-sky-cloud-brightness': timeState.cloudBrightness,
    '--site-sky-cloud-hue-rotate': `${timeState.cloudHueRotate}deg`,
    '--site-sky-cloud-opacity': timeState.cloudOpacity,
    '--site-sky-cloud-play-state': isCloudAnimationRunning && isPageVisible ? 'running' : 'paused',
    '--site-sky-cloud-saturate': timeState.cloudSaturate,
    '--site-sky-sky-bottom': timeState.skyBottom,
    '--site-sky-sky-lower': timeState.skyLower,
    '--site-sky-sky-middle': timeState.skyMiddle,
    '--site-sky-sky-top': timeState.skyTop,
    '--site-sky-sky-upper': timeState.skyUpper,
    '--site-sky-star-opacity': timeState.starOpacity,
    '--site-sky-star-play-state': timeState.starOpacity > 0 && isPageVisible ? 'running' : 'paused',
    '--site-sky-upper-glow-opacity': timeState.upperGlowOpacity,
    '--site-sky-upper-glow-rgb': timeState.upperGlowRgb,
    '--site-sky-upper-glow-soft-opacity': timeState.upperGlowOpacity * 0.64,
    '--site-sky-warm-glow-opacity': timeState.warmGlowOpacity,
    '--site-sky-warm-glow-rgb': timeState.warmGlowRgb,
    '--site-sky-warm-glow-soft-opacity': timeState.warmGlowOpacity * 0.32,
    '--site-sky-warm-glow-strong-opacity': timeState.warmGlowOpacity * 0.7,
  } as CSSProperties

  useEffect(() => {
    const syncPageVisibility = () => {
      setIsPageVisible(document.visibilityState === 'visible')
    }

    syncPageVisibility()
    document.addEventListener('visibilitychange', syncPageVisibility)

    return () => document.removeEventListener('visibilitychange', syncPageVisibility)
  }, [])

  useEffect(() => {
    if (!isPageVisible || loadedCloudLayerCount > 0) return

    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean }
      }
    ).connection

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || connection?.saveData) {
      return
    }

    let timeoutId = 0
    const scheduleCloudLoad = () => {
      timeoutId = window.setTimeout(() => {
        setLoadedCloudLayerCount(
          window.matchMedia('(max-width: 767px)').matches
            ? mobileCloudLayerCount
            : skyCloudLayers.length,
        )
      }, cloudLoadDelayMilliseconds)
    }

    if (document.readyState === 'complete') {
      scheduleCloudLoad()
    } else {
      window.addEventListener('load', scheduleCloudLoad, { once: true })
    }

    return () => {
      window.clearTimeout(timeoutId)
      window.removeEventListener('load', scheduleCloudLoad)
    }
  }, [isPageVisible, loadedCloudLayerCount])

  return (
    <div
      aria-hidden="true"
      className="site-background pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      data-initialized={isInitialized ? '' : undefined}
      style={backgroundStyle}
    >
      <div className="site-sky-stars" />
      {loadedCloudLayerCount > 0 ? (
        <div className="site-sky-clouds">
          {skyCloudLayers.slice(0, loadedCloudLayerCount).map((layer, index) => (
            <Image
              alt=""
              className={`site-sky-cloud site-sky-cloud-${index + 1}`}
              decoding="async"
              fetchPriority="low"
              height={layer.height}
              key={layer.src}
              loading="lazy"
              src={layer.src}
              unoptimized
              width={layer.width}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
