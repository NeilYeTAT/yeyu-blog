'use client'

import type { HTMLMotionProps } from 'motion/react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { type FC, useEffect, useRef, useState } from 'react'
import { useTransitionTheme } from '@/lib/hooks/animation'
import { cn } from '@/lib/utils/common/shadcn'
import avatar from './assets/img/haibaraai.webp'
import { icons } from './constant'

const menuRadius = 70
const menuAngles = [157.5, 112.5, 67.5, 22.5]

// TODO: 固定底部时吸附效果
// TODO: 类似 ipad cursor ?
export const DraggableFloatingMenu: FC<HTMLMotionProps<'div'>> = ({ className, ...props }) => {
  const pathname = usePathname()
  const { setTransitionTheme, resolvedTheme } = useTransitionTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const soundEffectRef = useRef<HTMLAudioElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const constraintsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    audioRef.current = new Audio('/music/日暮里 - JINBAO.mp3')
    audioRef.current.loop = true

    soundEffectRef.current = new Audio('/sound/ui-select.wav')

    return () => {
      audioRef.current?.pause()
      audioRef.current = null
      soundEffectRef.current = null
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current !== null && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  const playSoundEffect = () => {
    if (soundEffectRef.current !== null) {
      soundEffectRef.current.currentTime = 0
      soundEffectRef.current.play().catch(e => console.error('Sound effect play failed', e))
    }
  }

  const handleSelect = (id: string) => {
    if (id === 'bl') {
      setTransitionTheme('light', { direction: 'left', duration: 300 })
      playSoundEffect()
    } else if (id === 'br') {
      setTransitionTheme('dark', { direction: 'left', duration: 300 })
      playSoundEffect()
    } else if (id === 'tl') {
      audioRef.current?.pause()
      if (audioRef.current !== null) {
        audioRef.current.currentTime = 0
      }
      setIsPlaying(false)
    } else if (id === 'tr') {
      audioRef.current?.play().catch(e => console.error('Audio play failed', e))
      playSoundEffect()
      setIsPlaying(true)
    }
    setIsOpen(false)
  }

  if (pathname === '/') {
    return null
  }

  return (
    <>
      <div ref={constraintsRef} className="pointer-events-none fixed inset-16 z-50" />
      <motion.div
        ref={containerRef}
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          'fixed bottom-16 left-1/2 z-50 -translate-x-1/2 cursor-grab active:cursor-grabbing',
          className,
        )}
        {...props}
      >
        <div
          className="relative flex size-12 items-center justify-center rounded-full bg-white shadow-lg dark:bg-zinc-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Image
            src={avatar}
            alt="menu"
            className="size-full rounded-full object-cover"
            placeholder="blur"
          />
          <span className="animate-ye-ping-one-dot-one ring-clear-sky-indicator absolute top-0 left-0 size-full rounded-full ring-2 ring-offset-1 dark:ring-blue-800" />
        </div>

        <AnimatePresence>
          {isOpen && (
            <>
              {icons.map(({ id, Icon }, index) => {
                const isFunctionActive =
                  (id === 'tl' && !isPlaying) ||
                  (id === 'tr' && isPlaying) ||
                  (id === 'bl' && resolvedTheme === 'light') ||
                  (id === 'br' && resolvedTheme === 'dark')

                const angle = menuAngles[index]
                const radian = (angle * Math.PI) / 180
                const x = menuRadius * Math.cos(radian)
                const y = -menuRadius * Math.sin(radian)

                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x,
                      y,
                    }}
                    exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={cn(
                      'absolute top-1 left-1 flex size-10 cursor-pointer items-center justify-center rounded-full shadow-sm backdrop-blur-md transition-colors duration-300',
                      'bg-[#fafafa] dark:bg-zinc-800',
                      isFunctionActive
                        ? 'text-clear-sky-primary'
                        : 'text-zinc-500 dark:text-zinc-400',
                    )}
                    onClick={e => {
                      e.stopPropagation()
                      handleSelect(id)
                    }}
                  >
                    <Icon className="relative z-10 size-5" />
                  </motion.div>
                )
              })}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
