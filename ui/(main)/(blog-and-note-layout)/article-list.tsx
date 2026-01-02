import type { TagType } from '@prisma/client'
import type { ComponentProps, FC } from 'react'
import * as motion from 'motion/react-client'
import type { BlogListItem } from '@/actions/blogs/type'
import type { NoteListItem } from '@/actions/notes/type'
import { ArticleLink } from './article-link'

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

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const ArticleList: FC<
  ComponentProps<'div'> & {
    items: BlogListItem[] | NoteListItem[]
    type: TagType
  }
> = ({ items, type }) => {
  if (items.length === 0) {
    return <p className="m-auto">虚无。</p>
  }

  return (
    <motion.div
      className="group/list flex flex-col"
      initial="hidden"
      animate="visible"
      variants={listVariants}
    >
      {items.map(v => (
        <motion.div
          variants={itemVariants}
          key={v.id}
          className="transition-opacity group-hover/list:opacity-50! hover:opacity-100!"
          whileHover={{ scale: 1.01, transition: { type: 'spring', stiffness: 200, damping: 25 } }}
        >
          <ArticleLink item={v} type={type} />
        </motion.div>
      ))}
    </motion.div>
  )
}
