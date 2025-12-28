export default function BioSection() {
  return (
    <section className="flex flex-col gap-4 px-4 text-center">
      <h1>
        你好! 我是 <span className="text-clear-sky-primary font-bold">叶鱼</span>,
      </h1>
      <p>
        一名喜欢前端开发的大四学
        <span className="text-pink-500 line-through">生</span>牲
      </p>
      <p>欢迎来到我的主页, 我会在这里记录一些日记或者笔记, 感谢你的到来~</p>
      <small className="text-xs md:text-sm">
        话说敲两下头像可以切换主题来着 <span className="text-pink-500">( ´◔ ‸◔`)</span>
      </small>
    </section>
  )
}
