export default function BioSection() {
  return (
    <section className="flex flex-col gap-4 text-lg text-center px-4">
      <h1>
        你好! 我是 <span className="font-bold text-purple-400">叶鱼</span>,
      </h1>
      <p>欢迎来到我的博客, 我会在这里记录一些日记或者笔记, 感谢你的到来~</p>
      <p>
        我是一名喜欢前端开发的大三学
        <span className="line-through text-pink-500">生</span>牲
      </p>
      <p>
        以下是我常用/喜欢的技术{' '}
        <span className="text-indigo-400">(〃'▽'〃)</span>
      </p>
    </section>
  )
}
