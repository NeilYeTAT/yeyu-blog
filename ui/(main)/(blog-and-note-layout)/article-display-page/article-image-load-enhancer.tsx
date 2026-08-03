'use client'

import { useEffect, useRef, useState } from 'react'
import { Lightbox } from '@/ui/components/interior/lightbox'

export function ArticleImageLoadEnhancer({ rootSelector }: { rootSelector: string }) {
  const originRef = useRef<HTMLImageElement>(null)
  const [lightbox, setLightbox] = useState<{
    open: boolean
    src: string
    alt: string
    width?: number
    height?: number
  }>({
    open: false,
    src: '',
    alt: '',
  })

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(rootSelector)
    if (root == null) return

    const markImage = (image: HTMLImageElement) => {
      image.loading = 'lazy'
      image.decoding = 'async'
      image.tabIndex = 0
      image.setAttribute('role', 'button')
      image.setAttribute('aria-haspopup', 'dialog')
      image.dataset.articleImageLightbox = 'true'

      if (image.complete) {
        delete image.dataset.articleImageLoading
        return
      }

      image.dataset.articleImageLoading = 'true'
    }

    const markImages = () => {
      root.querySelectorAll<HTMLImageElement>('.md-image-frame > img').forEach(markImage)
    }

    const handleImageLoad = (event: Event) => {
      const target = event.target
      if (!(target instanceof HTMLImageElement)) return

      delete target.dataset.articleImageLoading
    }

    const openImage = (image: HTMLImageElement) => {
      originRef.current = image
      setLightbox({
        open: true,
        src: image.src,
        alt: image.alt,
        width: image.naturalWidth > 0 ? image.naturalWidth : undefined,
        height: image.naturalHeight > 0 ? image.naturalHeight : undefined,
      })
    }

    const handleImageClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof HTMLImageElement)) return
      if (!target.matches('.md-image-frame > img')) return

      event.preventDefault()
      openImage(target)
    }

    const handleImageKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (!(target instanceof HTMLImageElement)) return
      if (!target.matches('.md-image-frame > img')) return
      if (event.key !== 'Enter' && event.key !== ' ') return

      event.preventDefault()
      openImage(target)
    }

    markImages()

    const observer = new MutationObserver(() => {
      markImages()
    })

    observer.observe(root, {
      childList: true,
      subtree: true,
    })

    root.addEventListener('load', handleImageLoad, true)
    root.addEventListener('click', handleImageClick)
    root.addEventListener('keydown', handleImageKeyDown)

    return () => {
      observer.disconnect()
      root.removeEventListener('load', handleImageLoad, true)
      root.removeEventListener('click', handleImageClick)
      root.removeEventListener('keydown', handleImageKeyDown)
    }
  }, [rootSelector])

  return (
    <Lightbox
      open={lightbox.open}
      onClose={() => setLightbox(current => ({ ...current, open: false }))}
      src={lightbox.src}
      alt={lightbox.alt}
      width={lightbox.width}
      height={lightbox.height}
      originRef={originRef}
    />
  )
}
