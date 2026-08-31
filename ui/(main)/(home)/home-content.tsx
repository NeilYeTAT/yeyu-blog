import { siGithub, siGmail, siX } from 'simple-icons/icons'
import BioSection from './bio-section'
import YeAvatar from './ye-avatar'

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

export default function HomeContent() {
  return (
    <>
      <section className="mx-auto w-full max-w-[550px] px-4 pt-8 pb-28 font-serif md:px-0 md:pt-[116px] md:pb-[110px]">
        <div className="grid grid-cols-1 items-center justify-items-center gap-8 md:grid-cols-[180px_1fr] md:justify-items-stretch md:gap-16">
          <YeAvatar />
          <BioSection />
        </div>

        <div className="mt-10 space-y-7 text-[16px] leading-8">
          <div>
            <p>26 年大学毕业，工作至今，主业是前端工程师</p>
            <p>现在工作中会更喜欢写后端接口捏 φ(-ω-*)</p>
          </div>

          <div>
            <p>业余时间会尝试使用 Figma 来自己设计页面 φ(´･ω･｀)</p>
            <p>未来希望能成为一名设计工程师，做出让人觉得好看的设计 ( ˙◞˙ )</p>
          </div>

          <div>
            <p>目前在努力打工加仓 A 股</p>
            <p>我相信 A 股会让我早几年退休，而不是晚几年 (ㅅ´˘`)</p>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-[550px] items-center justify-between gap-4 px-4 pb-1 font-serif text-sm md:px-0">
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
    </>
  )
}
