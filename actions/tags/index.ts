'use server'

import { WithTagIdValues } from '@/components/modal/edit-tag-modal'
import { prisma } from '@/db'
import { TagType } from '@prisma/client'

export const createBlogTag = async (tagName: string) => {
  const existingTagName = await prisma.blogTag.findFirst({
    where: {
      tagName,
    },
  })

  if (existingTagName) {
    throw new Error('标签名已存在')
  }

  return await prisma.blogTag.create({
    data: {
      tagName,
    },
  })
}

export const createNoteTag = async (tagName: string) => {
  const existingTagName = await prisma.noteTag.findFirst({
    where: {
      tagName,
    },
  })

  if (existingTagName) {
    throw new Error('标签名已存在')
  }

  return await prisma.noteTag.create({
    data: {
      tagName,
    },
  })
}

export const deleteBlogTagById = async (tagId: number) => {
  const tag = await prisma.blogTag.findUnique({ where: { id: tagId } })
  if (!tag) throw new Error('标签不存在')

  return await prisma.blogTag.delete({
    where: {
      id: tagId,
    },
  })
}

export const deleteNoteTagById = async (tagId: number) => {
  const tag = await prisma.noteTag.findUnique({ where: { id: tagId } })
  if (!tag) throw new Error('标签不存在')

  return await prisma.noteTag.delete({
    where: {
      id: tagId,
    },
  })
}

export const updateBlogTagById = async (values: WithTagIdValues) => {
  const { tagId, tagName } = values

  const existingTag = await prisma.blogTag.findFirst({
    where: {
      tagName,
      NOT: {
        id: tagId,
      },
    },
  })

  if (existingTag) {
    throw new Error(`标签名 "${tagName}" 已存在`)
  }

  return await prisma.blogTag.update({
    where: {
      id: tagId,
    },
    data: {
      tagName,
    },
  })
}

export const updateNoteTagById = async (values: WithTagIdValues) => {
  const { tagId, tagName } = values

  const existingTag = await prisma.noteTag.findFirst({
    where: {
      tagName,
      NOT: {
        id: tagId,
      },
    },
  })

  if (existingTag) {
    throw new Error(`标签名 "${tagName}" 已存在`)
  }

  return await prisma.noteTag.update({
    where: {
      id: tagId,
    },
    data: {
      tagName,
    },
  })
}

export const getBlogTagsAndNoteTags = async () => {
  const [blogTags, noteTags] = await Promise.all([
    prisma.blogTag.findMany({
      include: {
        _count: true,
      },
    }),
    prisma.noteTag.findMany({
      include: {
        _count: true,
      },
    }),
  ])
  // * 标准化输出结构，加上统一的 `count` 字段, 前端就不用处理了, 希望以后也有这么好的后端🥹
  const blogTagsWithCount = blogTags.map(tag => ({
    id: tag.id,
    tagName: tag.tagName,
    tagType: TagType.BLOG,
    count: tag._count.blogs,
  }))

  const noteTagsWithCount = noteTags.map(tag => ({
    id: tag.id,
    tagName: tag.tagName,
    tagType: TagType.NOTE,
    count: tag._count.notes,
  }))

  return [...blogTagsWithCount, ...noteTagsWithCount]
}

export const getQueryTags = async (tagName: string) => {
  const [blogTags, noteTags] = await Promise.all([
    prisma.blogTag.findMany({
      where: {
        tagName: {
          contains: tagName,
        },
      },
      include: {
        _count: true,
      },
    }),
    prisma.noteTag.findMany({
      where: {
        tagName: {
          contains: tagName,
        },
      },
      include: {
        _count: true,
      },
    }),
  ])

  const blogTagsWithCount = blogTags.map(tag => ({
    id: tag.id,
    tagName: tag.tagName,
    tagType: TagType.BLOG,
    count: tag._count.blogs,
  }))

  const noteTagsWithCount = noteTags.map(tag => ({
    id: tag.id,
    tagName: tag.tagName,
    tagType: TagType.NOTE,
    count: tag._count.notes,
  }))

  return [...blogTagsWithCount, ...noteTagsWithCount]
}
