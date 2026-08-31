import TechStack from './tech-stack'

export default function BioSection() {
  return (
    <section className="flex flex-col items-center text-center md:translate-y-[5px] md:items-start md:text-left">
      <h1 className="font-bold text-xl leading-8 sm:text-2xl">你好! 我是 叶鱼 ( ^¯꒳¯^ )ﾉﾉ</h1>
      <p className="mt-[22px] font-bold text-[16px] leading-8">TypeScript 全栈开发者 ⸜( *ˊᵕˋ* )⸝</p>
      <TechStack />
    </section>
  )
}
