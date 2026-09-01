import type { Metadata } from 'next'
import type { Language } from '@/lib/i18n/config'

const sharedMetadata = {
  metadataBase: new URL('https://www.useyeyu.cc'),
  robots: {
    index: true,
    follow: true,
  },
} satisfies Metadata

export const seoMetadata = {
  zh: {
    root: {
      ...sharedMetadata,
      title: {
        default: '叶鱼 & 业余',
        template: '%s & 叶鱼',
      },
      description: '业余全栈开发，生活记录',
      keywords: [
        '叶鱼',
        '业余',
        '前端开发',
        '全栈开发',
        '技术博客',
        'React',
        'Next.js',
        'Node.js',
        'NestJS',
        'JavaScript',
        'TypeScript',
        'Web Development',
      ],
      authors: [
        {
          name: '叶鱼',
          url: 'https://www.useyeyu.cc',
        },
      ],
      creator: '叶鱼',
    },
    home: {
      title: '首页',
      description: '叶鱼的个人主页，记录全栈开发、设计与生活。',
      alternates: {
        canonical: '/zh',
        languages: { zh: '/zh', en: '/en' },
      },
    },
    blog: {
      title: '日志',
      description: '记录全栈开发、设计与生活的文章。',
      alternates: {
        canonical: '/zh/blog',
        languages: { zh: '/zh/blog', en: '/en/blog' },
      },
    },
    friends: {
      title: '友链',
      description: '叶鱼的朋友们与友链申请。',
      alternates: {
        canonical: '/zh/friends',
        languages: { zh: '/zh/friends', en: '/en/friends' },
      },
    },
    articleDescription: (title: string) => `阅读叶鱼的文章《${title}》。`,
  },
  en: {
    root: {
      ...sharedMetadata,
      title: {
        default: 'Yuuri & Spare Time',
        template: '%s & Yuuri',
      },
      description: 'Full-stack development and notes on life',
      keywords: [
        'Yuuri',
        'Frontend Development',
        'Full-stack Development',
        'Tech Blog',
        'React',
        'Next.js',
        'Node.js',
        'NestJS',
        'JavaScript',
        'TypeScript',
        'Web Development',
      ],
      authors: [
        {
          name: 'Yuuri',
          url: 'https://www.useyeyu.cc',
        },
      ],
      creator: 'Yuuri',
    },
    home: {
      title: 'Home',
      description: "Yuuri's personal site about full-stack development, design, and life.",
      alternates: {
        canonical: '/en',
        languages: { zh: '/zh', en: '/en' },
      },
    },
    blog: {
      title: 'Blog',
      description: 'Articles about full-stack development, design, and life.',
      alternates: {
        canonical: '/en/blog',
        languages: { zh: '/zh/blog', en: '/en/blog' },
      },
    },
    friends: {
      title: 'Friends',
      description: "Yuuri's friends and friend link applications.",
      alternates: {
        canonical: '/en/friends',
        languages: { zh: '/zh/friends', en: '/en/friends' },
      },
    },
    articleDescription: (title: string) => `Read "${title}" on Yuuri's blog.`,
  },
} satisfies Record<
  Language,
  {
    root: Metadata
    home: Metadata
    blog: Metadata
    friends: Metadata
    articleDescription: (title: string) => string
  }
>
