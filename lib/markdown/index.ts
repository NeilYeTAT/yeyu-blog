import { transformerCopyButton } from '@rehype-pretty/transformers'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

// * markdown文档渲染配置
export const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypePrettyCode, {
    // ! 这里写没用，需要再去 globals.css 中去写一下名字，不然打包压缩会报错
    theme: {
      dark: 'aurora-x',
      light: 'github-light',
    },
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
  prose prose-base sm:prose-lg max-w-none dark:prose-invert

  prose-h1:text-3xl sm:prose-h1:text-5xl 
  prose-h2:text-2xl sm:prose-h2:text-4xl 
  prose-h3:text-xl sm:prose-h3:text-3xl 
  prose-h4:text-lg sm:prose-h4:text-2xl 
  prose-h5:text-base sm:prose-h5:text-xl 
  prose-h6:text-base sm:prose-h6:text-xl

  prose-h1:text-[#e64553] dark:prose-h1:text-[#ff757f]
  prose-h2:text-[#fe640b] dark:prose-h2:text-[#e0af68]
  prose-h3:text-[#df8e1d] dark:prose-h3:text-[#9ece6a]
  prose-h4:text-[#1e66f5] dark:prose-h4:text-[#7dcfff]
  prose-h5:text-[#7287fd] dark:prose-h5:text-[#7aa2f7]
  prose-h6:text-[#209fb5] dark:prose-h6:text-[#bb9af7]

  prose-h1:text-center
  prose-h2:text-center
  prose-h3:text-center
  prose-h4:text-center
  prose-h5:text-center
  prose-h6:text-center

  prose-code:font-normal prose-code:font-mono prose-code:rounded-sm
  prose-strong:font-bold prose-strong:text-[#ea76cb] dark:prose-strong:text-[#f5c2e7]

  prose-a:text-[#1e66f5] prose-a:hover:text-[#209fb5] 
  dark:prose-a:text-[#89b4fa] dark:prose-a:hover:text-[#74c7ec] 
  prose-a:transition-all

  prose-img:border prose-img:border-dashed prose-img:rounded-sm 
  prose-img:p-1 prose-img:hover:scale-105 prose-img:duration-300 
  prose-img:m-auto

  prose-ul:marker:text-[#9ca0b0] dark:prose-ul:marker:text-[#6c7086]
`

export const customMarkdownTheme = className
