'use client'

import { AnimatePresence, motion, useMotionValue } from 'motion/react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import avatar from '@/config/img/avatar.webp'
import { useTransitionTheme } from '@/hooks/animation/use-transition-theme'
import { useSound } from '@/hooks/common/use-sound'
import { uChatScrollButtonSound } from '@/lib/core/sound/u-chat-scroll-button'
import { useBackgroundMusicActions, useIsPlaying } from '@/store/use-background-music-store'
import { useModalActions } from '@/store/use-modal-store'
import { type IconsId, icons } from '../layout/draggable-floating-menu/constant'
import { FloatingMenuActionButton } from '../layout/draggable-floating-menu/floating-menu-action-button'

const dragConstraints = { top: 0, right: 0, bottom: 0, left: 0 }
const dragTransition = { bounceStiffness: 500, bounceDamping: 15 }
const tapAnimation = { scale: 0.99, rotate: 1 }
const proximityThreshold = 100
const proximityTargets = icons.map(({ id, initial }) => ({
  id,
  x: -initial.x * (id === 'lm' ? 85 / 30 : 100 / 30),
  y: -initial.y * 3,
}))

function getActiveIcon(currX: number, currY: number) {
  let closest: IconsId | null = null
  let minDistanceSquared = Infinity

  for (const target of proximityTargets) {
    const deltaX = currX - target.x
    const deltaY = currY - target.y
    const distanceSquared = deltaX * deltaX + deltaY * deltaY

    if (distanceSquared < minDistanceSquared) {
      minDistanceSquared = distanceSquared
      closest = target.id
    }
  }

  const currentThreshold = closest === 'lm' ? proximityThreshold + 30 : proximityThreshold
  return closest !== null && minDistanceSquared < currentThreshold * currentThreshold
    ? closest
    : null
}

export default function YeAvatar() {
  const { setTransitionTheme, resolvedTheme } = useTransitionTheme()

  const isPlaying = useIsPlaying()
  const { play, pause } = useBackgroundMusicActions()

  const { setModalOpen } = useModalActions()
  const [playClickSoft] = useSound(uChatScrollButtonSound)
  const [isDragging, setIsDragging] = useState(false)
  const [activeIcon, setActiveIcon] = useState<IconsId | null>(null)
  const activeIconRef = useRef<IconsId | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const playSoundEffect = () => {
    playClickSoft()
  }

  const handleDrag = () => {
    const nextActiveIcon = getActiveIcon(x.get(), y.get())
    if (activeIconRef.current === nextActiveIcon) return

    activeIconRef.current = nextActiveIcon
    setActiveIcon(nextActiveIcon)
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {isDragging && (
          <>
            {icons.map(({ id, Icon, className, initial }) => {
              const isFunctionActive =
                (id === 'tl' && !isPlaying) ||
                (id === 'tr' && isPlaying) ||
                (id === 'bl' && resolvedTheme === 'light') ||
                (id === 'br' && resolvedTheme === 'dark')

              return (
                <FloatingMenuActionButton
                  key={id}
                  initial={{ opacity: 0, scale: 0.95, ...initial }}
                  animate={{
                    opacity: 1,
                    scale: activeIcon === id ? 1.2 : 1,
                    x: 0,
                    y: 0,
                  }}
                  exit={{ opacity: 0, scale: 0.95, ...initial }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`absolute z-50 ${className}`}
                  isActive={activeIcon === id || isFunctionActive}
                  showPing={activeIcon === id}
                >
                  <Icon
                    className="relative z-10 size-5"
                    isActive={activeIcon === id || isFunctionActive}
                    size={20}
                  />
                </FloatingMenuActionButton>
              )
            })}
          </>
        )}
      </AnimatePresence>

      {/* 摸摸头~ */}
      <motion.figure
        // TODO: config color
        className="relative cursor-grab drop-shadow-2xl active:cursor-grabbing active:drop-shadow-[0_0_16px_var(--theme-indicator)] dark:active:drop-shadow-[0_0_16px_rgba(192,192,192,0.7)]"
        whileTap={tapAnimation}
        drag
        dragConstraints={dragConstraints}
        dragTransition={dragTransition}
        dragElastic={0.25}
        onDrag={handleDrag}
        onPointerDown={event => {
          event.currentTarget.style.willChange = 'transform'
          setIsDragging(true)
        }}
        onPointerUp={event => {
          event.currentTarget.style.willChange = ''
          setIsDragging(false)
        }}
        onPointerCancel={event => {
          event.currentTarget.style.willChange = ''
          setIsDragging(false)
        }}
        onDragEnd={() => {
          const selected = activeIconRef.current

          if (selected === 'bl') {
            setTransitionTheme('light', { direction: 'left', duration: 300 })
            playSoundEffect()
          } else if (selected === 'br') {
            setTransitionTheme('dark', { direction: 'right', duration: 300 })
            playSoundEffect()
          } else if (selected === 'tl') {
            pause()
          } else if (selected === 'tr') {
            play()
            playSoundEffect()
          } else if (selected === 'lm') {
            setModalOpen('selectThemeModal')
            playSoundEffect()
          }

          setIsDragging(false)
          setActiveIcon(null)
          activeIconRef.current = null
        }}
        style={{ x, y }}
      >
        <Image
          src={avatar}
          alt="avatar"
          className="w-44 rounded-full md:w-52"
          sizes="(min-width: 768px) 13rem, 11rem"
          placeholder="blur"
          preload
          fetchPriority="high"
          draggable={false}
        />
        <span className="absolute top-0 left-0 size-full animate-ye-ping-one-dot-one rounded-full ring-4 ring-theme-400 ring-offset-1 dark:ring-white dark:ring-offset-black" />
      </motion.figure>
    </div>
  )
}
