import '@/lib/core/markdown/styles/index.css'
import BlogLayout from '@/ui/(main)/blog/layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BlogLayout>{children}</BlogLayout>
}
