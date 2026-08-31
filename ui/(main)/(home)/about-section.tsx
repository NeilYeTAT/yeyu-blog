import { HomeTextMotion } from './home-motion'

export default function AboutSection() {
  return (
    <div className="mt-10 space-y-7 text-[16px] leading-8">
      <HomeTextMotion>
        <p>26 年大学毕业，工作至今，主业是前端工程师</p>
        <p>现在工作中会更喜欢写后端接口捏 φ(-ω-*)</p>
      </HomeTextMotion>

      <HomeTextMotion>
        <p>业余时间会尝试使用 Figma 来自己设计页面 φ(´･ω･｀)</p>
        <p>未来希望能成为一名设计工程师，做出让人觉得好看的设计 ( ˙◞˙ )</p>
      </HomeTextMotion>

      <HomeTextMotion>
        <p>目前在努力打工加仓 A 股</p>
        <p>我相信 A 股会让我早几年退休，而不是晚几年 (ㅅ´˘`)</p>
      </HomeTextMotion>
    </div>
  )
}
