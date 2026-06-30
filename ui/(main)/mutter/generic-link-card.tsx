'use client'

import Image, { type ImageLoaderProps } from 'next/image'

const passthroughImageLoader = ({ src }: ImageLoaderProps) => src

export function GenericLinkCard({
  faviconUrl,
  href,
  hostname,
  label,
}: {
  faviconUrl: string
  href: string
  hostname: string
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex min-h-12 items-center gap-3 overflow-hidden rounded-xl border border-zinc-200 bg-white px-3 py-2 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
    >
      <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={faviconUrl}
          alt=""
          width={16}
          height={16}
          loader={passthroughImageLoader}
          unoptimized
        />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-[13px] text-zinc-800 leading-5 dark:text-zinc-100">
          {label}
        </span>
        <span className="truncate text-[11px] text-zinc-400 leading-4 dark:text-zinc-500">
          {hostname}
        </span>
      </span>
    </a>
  )
}
