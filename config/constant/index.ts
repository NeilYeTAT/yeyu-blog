import type { Metadata } from 'next'

// * --------------- 以下配置您可以自定义 ---------------

// * -- 管理员邮箱数组，配置了才能登录成功操作数据 --
// ! 需要去 .env 中配置
export const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',')

// * 元数据，SEO，网页关键字。。。
export const metadata: Metadata = {
  title: `叶鱼 | 业余`,
  description: '记录前端开发、技术文章与生活思考的博客站点',
  keywords: [
    '前端开发',
    '技术博客',
    'React',
    'Next.js',
    'vue',
    'javascript',
    'typescript',
    '阅读',
    '叶鱼',
  ],
  authors: [{ name: '叶鱼', url: 'https://useyeyu.cc' }],
  creator: '叶鱼',
}

// * 首页动画加载的文字，建议不要超过 5 个字，不然长度太长，当然，你也可以去修改样式~
export const INITIAL_WELCOME_TEXT = '业余'

// * 配置评论系统的官方文档 https://giscus.app/zh-CN
export const COMMENT_CARD_REPO = 'NeilYeTAT/yeyu-blog-comment'

// ! 需要去 .env 中配置
export const COMMENT_CARD_REPO_ID = process.env.NEXT_PUBLIC_COMMENT_CARD_REPO_ID ?? ''

// ! --------------- 以下配置不建议修改 ---------------

// *  -- prisma 长度限制 --
// ! prisma 中的数据大小限制并不是自动同步到这里，需要手动同步，这里抽取成常量只是为了表单验证的时候方便
// * Blog
export const BLOG_TITLE_MAX_LENGTH = 50

// * Note
export const NOTE_TITLE_MAX_LENGTH = 50

// * Tags
export const TAG_NAME_MAX_LENGTH = 20

// * Echo
export const ECHO_REFERENCE_MAX_LENGTH = 20
export const ECHO_CONTENT_MAX_LENGTH = 100

// * Article, 一般 Blog 和 Note 其实是共用的这个
export const ARTICLE_TITLE_MAX_LENGTH = 50
