'use client'

import { AnimatePresence, type HTMLMotionProps, motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { type FC, useEffect, useRef, useState } from 'react'
import { useTransitionTheme } from '@/hooks/animation/use-transition-theme'
import { useSound } from '@/hooks/common/use-sound'
import { uChatScrollButtonSound } from '@/lib/core/sound/u-chat-scroll-button'
import { cn } from '@/lib/utils/common/shadcn'
import { useBackgroundMusicActions, useIsPlaying } from '@/store/use-background-music-store'
import FluidOrb from '@/ui/shadcn/fluid-orb'
import { type IconsId, icons } from './constant'
import { FloatingMenuActionButton } from './floating-menu-action-button'

const menuRadius = 82
const menuAngles: Record<IconsId, number> = {
  tl: 160,
  tr: 20,
  bl: 125,
  br: 55,
}

// TODO: 固定底部时吸附效果
// TODO: 类似 ipad cursor ?
export const DraggableFloatingMenu: FC<HTMLMotionProps<'div'>> = ({ className, ...props }) => {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const { setTransitionTheme, resolvedTheme } = useTransitionTheme()

  const isPlaying = useIsPlaying()
  const { play, pause } = useBackgroundMusicActions()

  const [playClickSoft] = useSound(uChatScrollButtonSound)
  const [isOpen, setIsOpen] = useState(false)
  const [canSelectAction, setCanSelectAction] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const constraintsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current !== null && !containerRef.current.contains(event.target as Node)) {
        setCanSelectAction(false)
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
    playClickSoft()
  }

  const handleSelect = (id: IconsId) => {
    if (id === 'bl') {
      setTransitionTheme('light', { direction: 'left', duration: 300 })
      playSoundEffect()
    } else if (id === 'br') {
      setTransitionTheme('dark', { direction: 'right', duration: 300 })
      playSoundEffect()
    } else if (id === 'tl') {
      pause()
    } else if (id === 'tr') {
      play()
      playSoundEffect()
    }
    setCanSelectAction(false)
    setIsOpen(false)
  }

  return (
    <>
      <div
        ref={constraintsRef}
        className="pointer-events-none fixed top-24 right-20 bottom-4 left-20"
      />
      <motion.div
        ref={containerRef}
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0.2, y: 100, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className={cn(
          'fixed left-1/2 z-100 -ml-6 cursor-grab active:cursor-grabbing',
          isHomePage ? 'bottom-[100px]' : 'bottom-20',
          className,
        )}
        {...props}
      >
        <FloatingMenuActionButton
          aria-expanded={isOpen}
          aria-label="打开快捷菜单"
          className="relative z-10 size-12 cursor-pointer overflow-hidden border-white/70 p-0 shadow-[0_8px_20px_color-mix(in_srgb,var(--theme-accent)_35%,transparent)] dark:border-white/10 dark:shadow-[0_0_18px_rgba(255,255,255,0.3),0_10px_24px_rgba(0,0,0,0.56)]"
          onClick={() => {
            setCanSelectAction(false)
            setIsOpen(value => !value)
          }}
        >
          <FluidOrb size={48} color="var(--theme-accent)" aria-hidden />
          <span className="absolute top-0 left-0 size-full animate-ye-ping-one-dot-one rounded-full ring-2 ring-theme-ring ring-offset-1 ring-offset-background dark:ring-white dark:ring-offset-black" />
        </FloatingMenuActionButton>

        <AnimatePresence>
          {isOpen && (
            <>
              {icons.map(({ id, Icon }) => {
                const isFunctionActive =
                  (id === 'tl' && !isPlaying) ||
                  (id === 'tr' && isPlaying) ||
                  (id === 'bl' && resolvedTheme === 'light') ||
                  (id === 'br' && resolvedTheme === 'dark')

                const angle = menuAngles[id]
                const radian = (angle * Math.PI) / 180
                const x = menuRadius * Math.cos(radian)
                const y = -menuRadius * Math.sin(radian)

                return (
                  <FloatingMenuActionButton
                    key={id}
                    initial={{ opacity: 0, scale: 0.95, x: 0, y: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x,
                      y,
                    }}
                    exit={{ opacity: 0, scale: 0.95, x: 0, y: 0, pointerEvents: 'none' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="absolute top-1 left-1 cursor-pointer disabled:pointer-events-none"
                    disabled={!canSelectAction}
                    isActive={isFunctionActive}
                    onAnimationComplete={() => {
                      if (isOpen) setCanSelectAction(true)
                    }}
                    onClick={e => {
                      e.stopPropagation()
                      handleSelect(id)
                    }}
                  >
                    <Icon className="relative z-10 size-5" isActive={isFunctionActive} size={20} />
                  </FloatingMenuActionButton>
                )
              })}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
