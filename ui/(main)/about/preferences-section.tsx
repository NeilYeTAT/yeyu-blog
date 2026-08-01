import Link from 'next/link'
import { AboutLine, AboutSection } from './about-section'

export function PreferencesSection() {
  return (
    <AboutSection>
      <AboutLine>
        <p>
          最喜欢的日漫是《
          <Link className="underline" href="https://bgm.tv/subject/240038" target="_blank">
            青春猪头少年不会梦到兔女郎学姐
          </Link>
          》
        </p>
        <small>人活着就是为了麻衣学姐啊😭</small>
      </AboutLine>

      <AboutLine>
        <p>
          最喜欢的日剧是《
          <Link className="underline" href="https://www.ntv.co.jp/orebana/" target="_blank">
            我的事说来话长
          </Link>
          》
        </p>
        <small>活着能看到这种日剧真好啊😭</small>
      </AboutLine>

      <AboutLine>
        <p>
          最喜欢的电影是《
          <Link className="underline" href="https://bgm.tv/subject/328674" target="_blank">
            夏日幽灵
          </Link>
          》
        </p>
        <small>画风和音乐都太戳我了😭</small>
      </AboutLine>

      <AboutLine>
        <p>
          最喜欢的歌曲是《
          <Link
            className="underline"
            href="https://music.163.com/song?id=426881500&uct2=U2FsdGVkX18E241UFf04ntosQLXTETe3MNoxB5nJDKc="
            target="_blank"
          >
            三叶主题曲
          </Link>
          》
        </p>
        <small>每次听这首歌都觉得好遗憾啊🥹</small>
      </AboutLine>

      <AboutLine>
        <p>
          最喜欢的游戏是《
          <Link className="underline" href="https://forza.net/horizon" target="_blank">
            极限竞速: 地平线
          </Link>
          》系列
        </p>
        <small>让我不用出门就能看到处开车看风景🥹</small>
      </AboutLine>

      <AboutLine>
        <p>...</p>
      </AboutLine>

      <AboutLine>
        <small className="line-through">讨厌的东西太多就不说了，怕被枪毙</small>
      </AboutLine>
    </AboutSection>
  )
}
