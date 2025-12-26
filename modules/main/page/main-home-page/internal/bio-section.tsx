export default function BioSection() {
  return (
    <section className="flex flex-col gap-4 px-4 text-center">
      <h1>
        你好! 我是 <span className="font-bold text-purple-400">叶鱼</span>,
      </h1>
      <p>欢迎来到我的博客, 我会在这里记录一些日记或者笔记, 感谢你的到来~</p>
      <p>
        我是一名喜欢前端开发的大四学
        <span className="text-pink-500 line-through">生</span>牲
      </p>
      <p>
        下面是我常用/喜欢的技术 <span className="text-indigo-400">(〃'▽'〃)</span>
      </p>
      <small className="text-xs md:text-sm">
        话说敲两下头像可以切换主题来着 <span className="text-fuchsia-500">( ´◔ ‸◔`)</span>
      </small>
    </section>
  )
}
