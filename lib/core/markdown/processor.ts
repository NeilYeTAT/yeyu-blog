import { transformerCopyButton } from '@rehype-pretty/transformers'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

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
