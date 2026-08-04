import 'server-only'

import sharp from 'sharp'

type NodeLike = {
  type: string
  children?: NodeLike[]
  [key: string]: unknown
}

type ElementLike = NodeLike & {
  type: 'element'
  tagName: string
  properties?: Record<string, unknown>
  children: NodeLike[]
}

type ParentLike = {
  children: NodeLike[]
}

const isElement = (node: unknown): node is ElementLike => {
  return typeof node === 'object' && node !== null && (node as { type?: string }).type === 'element'
}

const imageDimensionPromises = new Map<string, Promise<{ width: number; height: number }>>()

const getImageDimensions = (src: string) => {
  const existingPromise = imageDimensionPromises.get(src)
  if (existingPromise != null) return existingPromise

  const dimensionPromise = fetch(src, { cache: 'force-cache' }).then(async response => {
    if (!response.ok) {
      throw new Error(`Failed to read image dimensions: ${src}`)
    }

    const metadata = await sharp(Buffer.from(await response.arrayBuffer())).metadata()
    if (metadata.width == null || metadata.height == null) {
      throw new Error(`Image dimensions are missing: ${src}`)
    }

    return {
      width: metadata.width,
      height: metadata.height,
    }
  })

  imageDimensionPromises.set(src, dimensionPromise)
  return dimensionPromise
}

const collectImages = (parent: ParentLike, images: ElementLike[]): void => {
  for (const child of parent.children) {
    if (isElement(child) && child.tagName === 'img') {
      images.push(child)
      continue
    }

    if ('children' in child && Array.isArray(child.children)) {
      collectImages(child as ParentLike, images)
    }
  }
}

const addImageDimensions = async (image: ElementLike) => {
  const src = image.properties?.src
  if (typeof src !== 'string' || src.length === 0) {
    throw new Error('Image source is missing')
  }

  const dimensions = await getImageDimensions(src)
  image.properties = {
    ...image.properties,
    width: dimensions.width,
    height: dimensions.height,
  }
}

const createImageFrame = (imageNode: ElementLike): ElementLike => {
  return {
    type: 'element',
    tagName: 'span',
    properties: {
      className: ['md-image-frame'],
    },
    children: [imageNode],
  }
}

const walkAndDecorate = (parent: ParentLike): void => {
  parent.children = parent.children.map(child => {
    if (isElement(child) && child.tagName === 'img') {
      return createImageFrame(child)
    }

    if ('children' in child && Array.isArray(child.children)) {
      walkAndDecorate(child as ParentLike)
    }

    return child
  })
}

export const rehypeImageFrameRenderer = () => {
  return async (tree: ParentLike) => {
    const images: ElementLike[] = []
    collectImages(tree, images)
    await Promise.all(images.map(addImageDimensions))
    walkAndDecorate(tree)
  }
}
