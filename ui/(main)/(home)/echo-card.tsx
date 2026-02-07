'use client'

import type { Echo } from '@prisma/client'
import { useRandomEchoIndexStore } from '@/store/use-display-echo-store'

export default function EchoCard({ allPublishedEcho }: { allPublishedEcho: Echo[] }) {
  const randomIndex = useRandomEchoIndexStore(s => s.randomIndex)
  const selectRandomIndex = useRandomEchoIndexStore(s => s.selectRandomIndex)

  if (randomIndex === null) selectRandomIndex(allPublishedEcho.length)

  const echo = allPublishedEcho[randomIndex ?? 0]

  return (
    <section className="mt-4 flex w-2/3 flex-col">
      <p
        suppressHydrationWarning
        className="underline drop-shadow-[0_0_0.75rem_#1babbb] dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
      >
        {echo?.content ?? '虚无。'}
      </p>
      <footer
        suppressHydrationWarning
        className="ml-auto font-thin text-pink-600 text-sm drop-shadow-[0_0_0.75rem_#1babbb] dark:text-white dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
      >
        「{echo?.reference ?? '无名。'}」
      </footer>
    </section>
  )
}
