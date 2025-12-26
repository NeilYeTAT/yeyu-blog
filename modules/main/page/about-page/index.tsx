import { ArrowDownIcon } from 'lucide-react'
import * as motion from 'motion/react-client'
import Link from 'next/link'
import HorizontalDividingLine from '@/ui/components/shared/horizontal-dividing-line'
import MaxWidthWrapper from '@/ui/components/shared/max-width-wrapper'

export default function AboutPage() {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: [30, -8, 0], opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
    >
      <MaxWidthWrapper className="mt-4 flex flex-col items-center justify-center gap-4 text-center md:text-lg">
        <p>嘿, 你好呀~👋🏻</p>
        <h2>
          你可以叫我, <span className="font-bold text-purple-400">叶鱼</span> ~
        </h2>
        <p>不是很想透露真名, 所以我有很多很多马甲~</p>
        <p>Neil, 揶揄, 叶鱼, 炆炆...~</p>
        <p>你可以随意称呼我~</p>
        <p>但求求你不要盒我喵🥹~</p>
        <p>
          我这先给您磕一个~ <small className="text-pink-400">orz</small>
        </p>

        <HorizontalDividingLine fill="#006A71" />

        <p>我是一个死宅~</p>
        <p>不喜欢吵闹的地方, 不喜欢人多的地方...</p>
        <p>平日在家就写写代码, 看看书~</p>
        <p>如果出了有趣的新番和游戏, 也是会尝试一下滴~</p>
        <p>但我一般只在夏天玩游戏, 夜深人静开空调玩游戏很有感觉不是嘛~</p>
        <p>现在的我在为自由而努力着~</p>

        <h2>接下来是我的走马灯~</h2>

        <HorizontalDividingLine fill="#107B80" />

        <h3 className="text-indigo-400">2022年的暑假, 我高考考砸了...</h3>
        <p>
          看了
          <q>强风吹拂</q>, 一个暑假, 每天都在跑步~
        </p>
        <p>
          第一次接触电脑, 下载
          <q>steam游戏中心</q>
          🥹
        </p>
        <p>
          第一次编程, <code>print('Hello, World!')</code>
        </p>
        <p>
          感谢那个教会我使用电脑和带我走向编程道路的僵尸~
          <ArrowDownIcon className="m-auto mt-2 animate-bounce text-purple-500 md:size-10" />
        </p>
        <Link
          href="https://space.bilibili.com/19658621"
          target="_blank"
          className="rounded-sm px-4 py-2 font-mono underline hover:cursor-pointer hover:text-pink-600"
        >
          Frank
        </Link>

        <HorizontalDividingLine fill="#208D90" />

        <h3 className="text-indigo-400">2023年的暑假, 开始学习Java</h3>
        <p>玩了很多游戏~</p>
        <p>地平线4, 只狼, 去月球, 寻找天堂, 恋爱绮谭~</p>
        <p>妈的🤬, Java真难写, 转前端~</p>
        <p>卧槽, win11🫵🏻怎么崩了!😡</p>
        <p>购入 Macbook air m2😋</p>

        <HorizontalDividingLine fill="#30A09F" />

        <h3 className="text-indigo-400">2024年的暑假, 开始学习React</h3>
        <p>React 真有意思</p>
        <p>React 真有意思</p>
        <p>玩了 summer pockets😭, 一定要去一次圣地巡礼🥹</p>
        <p>重看了一遍「青春猪头少年不会梦到兔女郎学姐」😋</p>
        <p>人活着就是为了麻衣学姐😭</p>
        <p>🐀🐀要开始学日语了😡!</p>

        <HorizontalDividingLine fill="#48A6A7" />

        <h3 className="text-indigo-400">2025年五月初</h3>
        <p>准备暑期实习的项目和面试八股文...</p>
        <p>闲暇之余看一些Web3相关的东西~</p>
        <p>帮一个开源项目修改了几个拼写错误和几个简单的issue~</p>
        <p>收到了他们赠送的礼物~</p>
        <p>
          感谢
          <Link
            href="https://openbuild.xyz/"
            className="rounded-sm px-4 py-2 font-mono underline hover:cursor-pointer hover:text-emerald-400"
            target="_blank"
          >
            OpenBuild
          </Link>
        </p>
        <p>这也算是我第一个合并的pr~</p>

        <HorizontalDividingLine fill="#40B2AF" />

        <h3 className="text-indigo-400">2025年的暑假，开始实习</h3>
        <p>或许这将是第一次没有在深夜玩游戏的暑假(￣∇￣)</p>
        <p>专注力好像又提高了</p>
        <p>我爱安静的环境 ~(^ω^)</p>
        <p>突然发现</p>
        <p>找🐛和推理还挺像的/(゜▽゜)☆</p>
        <p>这难道就是我喜欢写代码的原因吗？</p>
        <p>哥们小时候梦想还是当侦探来着🥹</p>
      </MaxWidthWrapper>
    </motion.div>
  )
}
