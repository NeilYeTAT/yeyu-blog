import * as motion from 'motion/react-client'
import { customMarkdownTheme } from '@/lib/markdown'
import ArticleDisplayHeader from './internal/article-display-header'

export default function ArticleDisplayPage({
  title,
  createdAt,
  tags,
  content,
}: {
  title: string
  content: string
  createdAt: Date
  tags: string[]
}) {
  return (
    <div className="z-10 min-h-screen backdrop-blur-[1px]">
      <motion.article
        className="dark:border-accent flex max-w-3xl flex-1 flex-col gap-4 rounded-sm border border-dashed border-indigo-200 bg-slate-300/30 px-6 py-2 dark:bg-gray-900/30"
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: [30, -2, 0],
        }}
        transition={{
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.8,
        }}
      >
        <ArticleDisplayHeader title={title} createdAt={createdAt} tags={tags} />
        {/* 渲染的主要内容 */}
        <main className={customMarkdownTheme} dangerouslySetInnerHTML={{ __html: content }} />
      </motion.article>
    </div>
  )
}
