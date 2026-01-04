import type { FC, ReactNode } from 'react'
import { AnimatePresence, type HTMLMotionProps, motion } from 'motion/react'
import { cn } from '@/lib/utils/common/shadcn'

export const HoverCard: FC<
  HTMLMotionProps<'div'> & {
    title: string
    description: string
    icon?: ReactNode
    show: boolean
    color?: string
  }
> = ({ title, description, icon, show, className, color, style, ...props }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'border-border/50 bg-background/80 absolute top-0 right-0 z-50 w-64 rounded-xl border p-4 shadow-xl backdrop-blur-md',
            className,
          )}
          style={{ borderColor: color, ...style }}
          {...props}
        >
          <div className="mb-2 flex items-center gap-3">
            {icon != null ? (
              <div className="flex size-8 items-center justify-center">{icon}</div>
            ) : null}
            <h3 className="text-lg font-bold">{title}</h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
