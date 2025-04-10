import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import { transformerCopyButton } from '@rehype-pretty/transformers'

// * markdown文档渲染配置
export const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypePrettyCode, {
    theme: 'aurora-x',
    defaultLang: 'js',
    transformers: [
      transformerCopyButton({
        visibility: 'hover',
        feedbackDuration: 3_000,
      }),
    ],
  })
  .use(rehypeStringify)

// * markdown 主题配置
// * 这里抽出来定义整个 markdown 渲染的主题, 主要还是标题的大小和颜色问题🥹
// * 这里必须要设置成 className 才有 tailwind 的智能提示提示🥺, 先写完主题再换变量名算了
// * customMarkdownTheme
// * 基础配置 => 标题颜色 => 标题大小 => 代码样式 => 字体加粗效果 => 字体斜体 => 超链接 => 图片样式
// ! 没有高亮效果, 没有 HTML 支持, 没有下划线
const className = `
  prose prose-lg max-w-none prose-invert 
prose-h1:text-[#f46d74] prose-h2:text-[#d9b173] prose-h3:text-[#c0ea89] prose-h4:text-[#5ebf5e] prose-h5:text-[#83a1f1] prose-h6:text-[#b69bf1]
  prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-xl
  prose-code:font-normal prose-code:font-mono prose-code:rounded-sm
  prose-strong:font-bold prose-strong:text-pink-500
prose-a:hover:text-pink-400 prose-a:transition-all
  prose-img:border prose-img:border-dashed prose-img:rounded-sm prose-img:p-1 prose-img:hover:scale-105 prose-img:duration-300 prose-img:m-auto
`

export const customMarkdownTheme = className
