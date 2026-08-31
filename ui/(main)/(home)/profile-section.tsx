import Image from 'next/image'
import avatar from '@/config/img/avatar.webp'
import { HomeTextMotion } from './home-motion'
import TechStack from './tech-stack'

export default function ProfileSection() {
  return (
    <header className="grid grid-cols-1 items-center justify-items-center gap-8 md:grid-cols-[180px_1fr] md:justify-items-stretch md:gap-16">
      <figure className="size-[180px] shrink-0 overflow-hidden rounded-[64px] border border-[#eaeaea]">
        <Image
          src={avatar}
          alt="叶鱼的头像"
          className="size-full object-cover"
          sizes="180px"
          placeholder="blur"
          preload
          fetchPriority="high"
          draggable={false}
        />
      </figure>

      <div className="flex flex-col items-center text-center md:translate-y-[5px] md:items-start md:text-left">
        <HomeTextMotion>
          <h1 className="font-bold text-xl leading-8 sm:text-2xl">你好! 我是 叶鱼 ( ^¯꒳¯^ )ﾉﾉ</h1>
        </HomeTextMotion>
        <HomeTextMotion>
          <p className="mt-[22px] font-bold text-[16px] leading-8">
            TypeScript 全栈开发者 ⸜( *ˊᵕˋ* )⸝
          </p>
        </HomeTextMotion>
        <TechStack />
      </div>
    </header>
  )
}
