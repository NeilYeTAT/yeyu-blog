import { BlogProvider } from '@/components/context/blog-context'
import { BlogSearch } from '@/components/shared/article-input'
import ArticleTagsContainer from '@/components/shared/article-tags-container'
import BlogListTable from './internal/blog-list-table'
import { SelectedTagProvider } from '@/components/context/selected-tag'

export default function AdminBlogPage() {
  return (
    <BlogProvider>
      <SelectedTagProvider>
        <main className="w-full flex flex-col gap-2">
          <BlogSearch />
          <ArticleTagsContainer />
          <BlogListTable />
        </main>
      </SelectedTagProvider>
    </BlogProvider>
  )
}
