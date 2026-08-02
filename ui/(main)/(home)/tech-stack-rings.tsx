import type { CSSProperties, ReactNode } from 'react'

export function TechStackRings({
  outerItems,
  innerItems,
  ringBaseCount,
}: {
  outerItems: { key: string; component: ReactNode }[]
  innerItems: { key: string; component: ReactNode }[]
  ringBaseCount: number
}) {
  return (
    <section
      style={
        {
          '--n': ringBaseCount,
          '--outer-r': `calc(max(var(--min-r), calc((var(--n) * var(--view-w) / ${ringBaseCount > 5 ? 4 : 3}) / 6.28)) * 1.08)`,
          '--inner-r': 'calc(var(--outer-r) * 0.72)',
          width: 'calc(var(--outer-r) * 2)',
          height: 'calc(var(--outer-r) * 2)',
        } as CSSProperties & Record<'--n' | '--outer-r' | '--inner-r', string | number>
      }
      className="relative rounded-full [--min-r:176px] [--s:64px] [--view-w:100vw] md:[--min-r:344px] md:[--s:128px] md:[--view-w:64rem]"
    >
      <div className="absolute inset-0 animate-ye-spin-slowly motion-reduce:animate-none">
        {outerItems.map((item, i) => (
          <div
            key={`outer-${item.key}`}
            className="absolute left-1/2 z-10 size-12 -translate-x-1/2 md:size-24"
            style={{
              rotate: `${i * (360 / outerItems.length)}deg`,
              transformOrigin: 'center var(--outer-r)',
            }}
          >
            {item.component}
          </div>
        ))}
      </div>
      <div
        style={{
          width: 'calc(var(--inner-r) * 2)',
          height: 'calc(var(--inner-r) * 2)',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="absolute inset-0 animate-ye-spin-slowly [animation-direction:reverse] motion-reduce:animate-none">
          {innerItems.map((item, i) => (
            <div
              key={`inner-${item.key}`}
              className="absolute left-1/2 z-20 size-[2.5rem] -translate-x-1/2 md:size-[5rem]"
              style={{
                rotate: `${i * (360 / innerItems.length)}deg`,
                transformOrigin: 'center var(--inner-r)',
              }}
            >
              {item.component}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
