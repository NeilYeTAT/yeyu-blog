'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getBlogList, getBlogsBySelectedTagName, getQueryBlog } from '@/actions/blogs'
import { getBlogTags } from '@/actions/tags'
import Loading from '@/components/shared/loading'
import BlogListTable from './internal/blog-list-table'
import BlogSearch from './internal/blog-search'
import { BlogTagsContainer } from './internal/blog-tags-container'

export default function AdminBlogPage() {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const { data: blogList, isPending: blogListPending } = useQuery({
    queryKey: ['blog-list', query, selectedTags],
    queryFn: () => {
      if (query.trim().length > 0) return getQueryBlog(query)
      if (selectedTags.length > 0) return getBlogsBySelectedTagName(selectedTags)
      return getBlogList()
    },
    staleTime: 1000 * 30,
  })

  const { data: blogTags, isPending: blogTagsPending } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: getBlogTags,
  })

  return (
    <main className="flex w-full flex-col gap-2">
      <BlogSearch setQuery={setQuery} />

      {!blogTagsPending && (
        <BlogTagsContainer blogTagList={blogTags ?? []} setSelectedTags={setSelectedTags} />
      )}

      {blogListPending || blogTagsPending ? (
        <Loading />
      ) : (
        <BlogListTable blogList={blogList ?? []} />
      )}
    </main>
  )
}
