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
        className="underline drop-shadow-[0_0_0.75rem_#211C84] dark:drop-shadow-[0_0_0.75rem_#91DDCF]"
      >
        {echo?.content ?? '虚无。'}
      </p>
      <footer
        suppressHydrationWarning
        className="ml-auto text-sm font-thin text-pink-600 drop-shadow-[0_0_0.75rem_#211C84] dark:text-emerald-300 dark:drop-shadow-[0_0_0.75rem_#91DDCF]"
      >
        「{echo?.reference ?? '无名。'}」
      </footer>
    </section>
  )
}
