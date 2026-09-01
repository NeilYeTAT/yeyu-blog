import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { seoMetadata } from '@/config/seo'
import { getCurrentLanguage } from '@/lib/i18n/get-current-language'
import { prisma } from '@/prisma/instance'
import { BlogDetail } from '@/ui/(main)/blog/[slug]'

export async function generateStaticParams() {
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true },
    select: { slug: true },
  })

  return blogs.map(blog => ({ slug: blog.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const [{ slug }, language] = await Promise.all([params, getCurrentLanguage()])
  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: { title: true },
  })

  if (blog == null) {
    notFound()
  }

  return {
    title: blog.title,
    description: seoMetadata[language].articleDescription(blog.title),
    alternates: { canonical: `/blog/${slug}` },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug

  return <BlogDetail slug={slug} />
}
