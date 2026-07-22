import { FlowerIcon } from './flower-icon'

export default function HorizontalDividingLine() {
  return (
    <div className="relative flex w-full items-center justify-center">
      <hr className="absolute left-0 w-[45%] border-theme-indicator border-dashed dark:border-accent-foreground" />
      <div className="animate-ye-spin">
        <FlowerIcon className="text-theme-indicator dark:text-accent-foreground" />
      </div>
      <hr className="absolute right-0 w-[45%] border-theme-indicator border-dashed dark:border-accent-foreground" />
    </div>
  )
}
