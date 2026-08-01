import { AboutLine, AboutSection } from './about-section'

export function IntroSection() {
  return (
    <AboutSection>
      <AboutLine>
        <p>嗨, 你好呀~👋🏻</p>
      </AboutLine>
      <AboutLine>
        <h2>
          你可以叫我, <span className="font-bold text-theme-indicator">叶鱼</span> (●´ω｀●)ゞ
        </h2>
      </AboutLine>
      <AboutLine>
        <p>起初是发现「揶揄」这个词: 读音为yé yú</p>
        <p>指以言语或行为戏弄、嘲讽他人, 带有调笑或轻度侮辱的意味</p>
      </AboutLine>
      <AboutLine>
        <p>就想着取一个同音假名，用来「愚弄」人的(￣∇￣)</p>
        <small>唉哟我操这人怎么这么坏啊😅</small>
      </AboutLine>
      <AboutLine>
        <p>后面发现读音也同「业余」，觉得对我来说挺合适的，遂用到现在</p>
      </AboutLine>
    </AboutSection>
  )
}
