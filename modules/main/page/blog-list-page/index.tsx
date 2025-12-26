import * as motion from 'motion/react-client'
import { getAllShowBlogs } from '@/actions/blogs'
import BlogListItem from './internal/blog-list-item'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: [30, -8, 0],
    transition: {
      type: 'tween',
      ease: 'easeInOut',
      duration: 0.8,
    },
  },
}

export default async function BlogListPage() {
  const allBlogs = await getAllShowBlogs()

  if (allBlogs.length === 0) {
    return <p className="m-auto">虚无。</p>
  }

  return (
    <motion.main
      className="flex flex-col px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {allBlogs.map(v => (
        <motion.div variants={itemVariants} key={v.id}>
          <BlogListItem blogTitle={v.title} createdAt={v.createdAt} slug={v.slug} />
        </motion.div>
      ))}
    </motion.main>
  )
}
