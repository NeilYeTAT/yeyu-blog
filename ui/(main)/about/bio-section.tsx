import Link from 'next/link'
import { AboutLine, AboutSection } from './about-section'

export function BioSection() {
  return (
    <AboutSection>
      <AboutLine>
        <p>是个二次元死宅 _:(´□`」 ∠):_</p>
      </AboutLine>

      <AboutLine>
        <p>22 年 6 月高中毕业</p>
      </AboutLine>

      <AboutLine>
        <p>25 年 6 月参加实习工作</p>
      </AboutLine>

      <AboutLine>
        <p>26 年 6 月大学毕业，逃离学校</p>
      </AboutLine>

      <AboutLine>
        <p>目前只想专注于 TypeScript 这一门编程语言</p>
        <p>我还是更喜欢前端一些</p>
      </AboutLine>

      <AboutLine>
        <p>
          未来想要成为像{' '}
          <Link className="underline" href={'https://x.com/emilkowalski'} target="_blank">
            Emil Kowalski
          </Link>{' '}
          一样的设计工程师
        </p>
      </AboutLine>
    </AboutSection>
  )
}
