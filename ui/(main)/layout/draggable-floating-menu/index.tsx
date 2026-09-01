'use client'

import { X } from 'lucide-react'
import { type HTMLMotionProps, motion } from 'motion/react'
import { useTheme } from 'next-themes'
import { type FC, useRef, useState } from 'react'
import { useSound } from '@/hooks/common/use-sound'
import { uChatScrollButtonSound } from '@/lib/core/sound/u-chat-scroll-button'
import { cn } from '@/lib/utils/common/shadcn'
import { useBackgroundMusicActions, useIsPlaying } from '@/store/use-background-music-store'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import FluidOrb from '@/ui/shadcn/fluid-orb'
import { MoonIcon } from '@/ui/shadcn/moon'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/shadcn/popover'
import { SunIcon } from '@/ui/shadcn/sun'
import { Switch } from '@/ui/shadcn/switch'
import { VolumeIcon } from '@/ui/shadcn/volume'
import { VolumeOffIcon } from '@/ui/shadcn/volume-off'
import { FloatingMenuActionButton } from './floating-menu-action-button'
import { SkyBackgroundControls } from './sky-background-controls'

// TODO: 固定底部时吸附效果
// TODO: 类似 ipad cursor ?
export const DraggableFloatingMenu: FC<HTMLMotionProps<'div'>> = ({
  className,
  onDragEnd,
  onDragStart,
  ...props
}) => {
  const translations = useTranslations()
  const { setTheme, resolvedTheme } = useTheme()

  const isPlaying = useIsPlaying()
  const { play, pause } = useBackgroundMusicActions()

  const [playClickSoft] = useSound(uChatScrollButtonSound)
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [orbAnimationPulse, setOrbAnimationPulse] = useState(0)
  const constraintsRef = useRef<HTMLDivElement>(null)

  const playSoundEffect = () => {
    playClickSoft()
  }

  const handleMusicChange = (shouldPlay: boolean) => {
    if (shouldPlay) {
      play()
      playSoundEffect()
      return
    }

    pause()
  }

  const handleThemeChange = (nextTheme: 'light' | 'dark') => {
    if (resolvedTheme === nextTheme) return

    setTheme(nextTheme)
    playSoundEffect()
  }

  const handleOpenChange = (nextIsOpen: boolean) => {
    setIsOpen(nextIsOpen)
    setOrbAnimationPulse(value => value + 1)
  }

  return (
    <>
      <div
        ref={constraintsRef}
        className="pointer-events-none fixed top-20 right-4 bottom-4 left-4 sm:right-5 sm:left-5"
      />
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <motion.div
          drag={!isOpen}
          dragConstraints={constraintsRef}
          dragElastic={0.08}
          dragMomentum={false}
          dragTransition={{ bounceStiffness: 500, bounceDamping: 30 }}
          whileDrag={{ scale: 1.04 }}
          initial={{ scale: 0.2, y: 100, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          onDragStart={(event, info) => {
            setIsDragging(true)
            onDragStart?.(event, info)
          }}
          onDragEnd={(event, info) => {
            setIsDragging(false)
            setOrbAnimationPulse(value => value + 1)
            onDragEnd?.(event, info)
          }}
          className={cn(
            'fixed bottom-[100px] left-1/2 z-100 -ml-6 size-12 touch-none select-none',
            !isOpen && 'cursor-grab active:cursor-grabbing',
            className,
          )}
          {...props}
        >
          <PopoverTrigger
            render={
              <FloatingMenuActionButton
                aria-label={
                  isOpen ? translations.common.closeQuickMenu : translations.common.openQuickMenu
                }
                className="relative z-10 size-12 cursor-pointer overflow-hidden border-white/70 p-0 shadow-[0_8px_20px_color-mix(in_srgb,var(--theme-accent)_35%,transparent)] dark:border-white/15 dark:shadow-[0_0_16px_rgba(255,255,255,0.14),0_10px_24px_rgba(0,0,0,0.42)]"
              />
            }
          >
            <FluidOrb
              size={48}
              color="var(--theme-accent)"
              animationPulse={orbAnimationPulse}
              isAnimating={isDragging}
              aria-hidden
            />
            <span className="absolute top-0 left-0 size-full animate-ye-ping-one-dot-one rounded-full ring-2 ring-theme-ring ring-offset-1 ring-offset-background dark:ring-white/65 dark:ring-offset-zinc-950" />
          </PopoverTrigger>
        </motion.div>

        <PopoverContent
          side="top"
          sideOffset={12}
          animation="fade"
          className="max-h-[min(38rem,calc(100dvh-7rem))] w-[min(19rem,calc(100vw-2rem))] overflow-y-auto rounded-lg border-border/60 bg-background/94 p-2 shadow-lg backdrop-blur-xl dark:border-white/12 dark:bg-zinc-950/82 dark:shadow-[0_20px_48px_rgba(0,0,0,0.38)]"
        >
          <div className="flex h-9 items-center justify-between px-2">
            <h2 className="font-medium text-sm">{translations.common.quickSettings}</h2>
            <button
              type="button"
              aria-label={translations.common.closeQuickMenu}
              className="flex size-7 cursor-pointer items-center justify-center rounded-full text-foreground/50 transition-colors hover:bg-foreground/8 hover:text-foreground focus-visible:outline-2 focus-visible:outline-theme-ring"
              onClick={() => handleOpenChange(false)}
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>

          <div className="divide-y divide-border/60">
            <div className="flex min-h-12 items-center justify-between gap-4 px-2 py-2">
              <div className="flex min-w-0 items-center gap-2.5">
                {isPlaying ? (
                  <VolumeIcon aria-hidden className="size-4.5 shrink-0" size={18} />
                ) : (
                  <VolumeOffIcon aria-hidden className="size-4.5 shrink-0" size={18} />
                )}
                <span className="truncate text-sm">{translations.common.backgroundMusic}</span>
              </div>
              <Switch
                checked={isPlaying}
                onCheckedChange={handleMusicChange}
                aria-label={
                  isPlaying ? translations.common.pauseMusic : translations.common.playMusic
                }
                className="cursor-pointer"
              />
            </div>

            <SkyBackgroundControls />

            <div className="flex min-h-12 items-center justify-between gap-4 px-2 py-2">
              <span className="shrink-0 text-sm">{translations.common.appearance}</span>
              <div
                role="group"
                aria-label={translations.common.appearance}
                className="relative grid grid-cols-2 rounded-full bg-foreground/6 p-0.5"
              >
                <motion.span
                  aria-hidden
                  className="absolute top-0.5 right-1/2 bottom-0.5 left-0.5 rounded-full bg-background shadow-sm"
                  initial={false}
                  animate={{ x: resolvedTheme === 'dark' ? '100%' : '0%' }}
                  transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.7 }}
                />
                <button
                  type="button"
                  aria-pressed={resolvedTheme === 'light'}
                  aria-label={translations.common.switchToLightTheme}
                  className={cn(
                    'relative z-10 flex h-7 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-theme-ring',
                    resolvedTheme === 'light'
                      ? 'text-foreground'
                      : 'text-foreground/50 hover:text-foreground/80',
                  )}
                  onClick={() => handleThemeChange('light')}
                >
                  <SunIcon aria-hidden className="size-3.5" size={14} />
                  {translations.common.lightTheme}
                </button>
                <button
                  type="button"
                  aria-pressed={resolvedTheme === 'dark'}
                  aria-label={translations.common.switchToDarkTheme}
                  className={cn(
                    'relative z-10 flex h-7 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-theme-ring',
                    resolvedTheme === 'dark'
                      ? 'text-foreground'
                      : 'text-foreground/50 hover:text-foreground/80',
                  )}
                  onClick={() => handleThemeChange('dark')}
                >
                  <MoonIcon aria-hidden className="size-3.5" size={14} />
                  {translations.common.darkTheme}
                </button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
