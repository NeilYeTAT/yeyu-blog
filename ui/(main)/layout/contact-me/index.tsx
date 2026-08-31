import { siGithub, siGmail, siX } from 'simple-icons/icons'

const externalLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/yeyuqwer',
    icon: siGithub,
  },
  {
    name: 'X',
    url: 'https://x.com/yeyuTvT',
    icon: siX,
  },
  {
    name: 'Gmail',
    url: 'mailto:yeyuqwer@gmail.com',
    icon: siGmail,
  },
]

export function ContactMe() {
  return (
    <footer className="mx-auto flex w-full max-w-[550px] items-center justify-between gap-4 pb-1 font-serif text-sm">
      <p className="shrink-0 leading-5">© {new Date().getFullYear()} 叶鱼</p>

      <nav aria-label="社交链接" className="flex justify-end gap-6">
        {externalLinks.map(link => (
          <a
            aria-label={link.name}
            className="size-5 text-zinc-700 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4 dark:text-zinc-300 dark:focus-visible:outline-white dark:hover:text-white"
            href={link.url}
            key={link.url}
            target="_blank"
            rel="noreferrer"
          >
            <svg role="img" viewBox="0 0 24 24" className="size-full" fill="currentColor">
              <path d={link.icon.path} />
            </svg>
          </a>
        ))}
      </nav>
    </footer>
  )
}
