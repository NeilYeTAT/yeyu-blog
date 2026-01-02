import { TagType } from '@prisma/client'
import { getAllShowBlogs } from '@/actions/blogs'
import { ArticleList } from '../article-list'

export default async function BlogListPage() {
  const allBlogs = await getAllShowBlogs()

  return <ArticleList items={allBlogs} type={TagType.BLOG} />
}
