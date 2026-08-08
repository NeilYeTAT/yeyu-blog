import { WaveLink } from '@/ui/components/shared/wave-link'

const externalLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/yeyuqwer',
  },
  {
    name: 'X',
    url: 'https://x.com/yeyuTvT',
  },
  {
    name: 'Gmail',
    url: 'mailto:yeyuqwer@gmail.com',
  },
] satisfies { name: string; url: string }[]

export function ContactMe() {
  return (
    <footer className="flex w-full items-center justify-between gap-4 text-sm md:text-base">
      <p className="shrink-0 font-serif text-theme-accent leading-none dark:text-[#888888]">
        © {new Date().getFullYear()} 叶鱼
      </p>

      <nav aria-label="社交链接" className="flex flex-wrap justify-end gap-x-4">
        {externalLinks.map(link => (
          <WaveLink
            className="text-theme-accent hover:text-theme-primary dark:text-[#888888] dark:hover:text-white"
            href={link.url}
            key={link.url}
            target="_blank"
          >
            {link.name}
          </WaveLink>
        ))}
      </nav>
    </footer>
  )
}
