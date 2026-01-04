import { cn } from '@/lib/utils/common/shadcn'

// * 后序给配置颜色
export default function ScaleUnderline({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        `absolute bottom-1 left-0 h-0.5 w-full origin-right scale-x-0 bg-pink-600 transition-transform duration-350 ease-[cubic-bezier(.77,0,.18,1)] group-hover:origin-left group-hover:scale-x-100`,
        className,
      )}
    />
  )
}
