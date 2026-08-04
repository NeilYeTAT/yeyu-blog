import { Emoticon } from '@/ui/components/shared/emoticon'

export default function BioSection() {
  return (
    <section className="flex flex-col gap-4 px-4 text-center">
      <h1>
        你好! 我是{' '}
        <span className="font-bold text-theme-primary">
          叶鱼 <Emoticon>(*´∪`)</Emoticon>
        </span>
      </h1>
      <p>
        专注于 TypeScript 全栈开发 <Emoticon>(ง *´▽`* )ว</Emoticon>
      </p>
      <p>
        欢迎来到我的主页 <Emoticon>Σ( ´･ω･`)</Emoticon>
      </p>
      <p>我把此处当作我的前端试验田，看到有意思的东西都会往里面塞</p>
      <small className="text-xs md:text-sm">
        话说上面的头像可以拖动来着 <Emoticon className="text-theme-accent">⸜( *ˊᵕˋ* )⸝</Emoticon>
      </small>
    </section>
  )
}
