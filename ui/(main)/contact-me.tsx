import type { ComponentProps, FC } from 'react'
import Link from 'next/link'

const ExternalLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/NeilYeTAT',
  },
  {
    name: 'bilibili',
    url: 'https://space.bilibili.com/1859558916',
  },
  {
    name: '掘金',
    url: 'https://juejin.cn/user/64204896208252',
  },
  {
    name: 'Gmail',
    url: 'mailto:nearjilt@gmail.com',
  },
] as const

export const ContactMe: FC<ComponentProps<'div'>> = () => {
  return (
    <main className="flex w-full flex-col items-center justify-center gap-2 md:gap-4">
      <h3>
        联系方式 -{' '}
        <small>
          如果你 <span className="text-pink-400 line-through">喜欢</span> 我的话~
        </small>
      </h3>
      <p className="flex gap-4 underline">
        {ExternalLinks.map(link => (
          <Link
            className="hover:text-purple-600 dark:hover:text-emerald-300"
            href={link.url}
            key={link.url}
            target="_blank"
          >
            {link.name}
          </Link>
        ))}
      </p>
    </main>
  )
}
