import type { Metadata } from 'next'
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
  const slug = (await params).slug
  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: { title: true },
  })

  return {
    title: blog?.title ?? '日志',
    description: blog?.title ?? '日志',
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug

  return <BlogDetail slug={slug} />
}
