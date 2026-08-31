'use client'

import type { Heading } from './utils/extract-headings'
import { useReducedMotion } from 'motion/react'
import {
  type FC,
  type MouseEvent,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { createPortal } from 'react-dom'
import { TocFloatingPanel } from './post-toc-floating-panel'

const emptyPortalState: {
  articleContent: HTMLElement | null
  container: HTMLElement | null
} = {
  articleContent: null,
  container: null,
}

let portalStateSnapshot = emptyPortalState

const subscribePortalState = (onStoreChange: () => void) => {
  const frame = requestAnimationFrame(onStoreChange)
  return () => cancelAnimationFrame(frame)
}

const getPortalStateSnapshot = () => {
  const articleContent = document.getElementById('article-content')
  const container = document.body

  if (
    portalStateSnapshot.articleContent === articleContent &&
    portalStateSnapshot.container === container
  ) {
    return portalStateSnapshot
  }

  portalStateSnapshot = {
    articleContent,
    container,
  }

  return portalStateSnapshot
}

const getServerPortalStateSnapshot = () => emptyPortalState

const useActiveHeading = (headings: Heading[]) => {
  const [{ activeId, direction }, setActiveHeading] = useState({
    activeId: '',
    direction: 1,
  })

  const updateActiveHeading = (nextActiveId: string) => {
    setActiveHeading(current => {
      if (current.activeId === nextActiveId) return current

      const nextIndex = headings.findIndex(heading => heading.id === nextActiveId)
      const currentIndex = headings.findIndex(heading => heading.id === current.activeId)
      let nextDirection = current.direction

      if (currentIndex !== -1 && nextIndex !== -1) {
        nextDirection = nextIndex > currentIndex ? 1 : -1
      }

      return {
        activeId: nextActiveId,
        direction: nextDirection,
      }
    })
  }
  const updateActiveHeadingEvent = useEffectEvent(updateActiveHeading)

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) updateActiveHeadingEvent(entry.target.id)
        })
      },
      { rootMargin: '-10% 0px -80% 0px' },
    )

    headings.forEach(heading => {
      const element = document.getElementById(heading.id)
      if (element != null) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  return { activeId, direction, updateActiveHeading }
}

export const PostToc: FC<{
  headings: Heading[]
}> = ({ headings }) => {
  const reduceMotion = Boolean(useReducedMotion())
  const { activeId, direction, updateActiveHeading } = useActiveHeading(headings)
  const [isExpanded, setIsExpanded] = useState(false)
  const portalState = useSyncExternalStore(
    subscribePortalState,
    getPortalStateSnapshot,
    getServerPortalStateSnapshot,
  )
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  if (headings.length === 0) return null
  if (portalState.container == null) return null

  const { articleContent, container } = portalState
  const activeHeading = headings.find(h => h.id === activeId) ?? headings[0]

  const scrollActiveLinkIntoView = () => {
    if (scrollContainerRef.current == null || activeId === '') return

    const activeLink = Array.from(
      scrollContainerRef.current.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
    ).find(link => link.hash.slice(1) === activeId)
    if (activeLink == null) return

    const container = scrollContainerRef.current
    const top = activeLink.offsetTop
    const linkHeight = activeLink.clientHeight
    const containerHeight = Math.min(container.scrollHeight, window.innerHeight * 0.6)

    container.scrollTo({
      top: top - containerHeight / 2 + linkHeight / 2,
      behavior: 'instant',
    })
  }

  const handleTocToggleClick = () => {
    if (isExpanded) {
      setIsExpanded(false)
      return
    }

    setIsExpanded(true)
    requestAnimationFrame(scrollActiveLinkIntoView)
  }

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()

    const element = document.getElementById(id)
    const mainScrollContainer = document.querySelector<HTMLElement>('[data-main-scroll-container]')
    if (element != null && mainScrollContainer != null) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const containerPosition = mainScrollContainer.getBoundingClientRect().top
      const offsetPosition =
        elementPosition - containerPosition + mainScrollContainer.scrollTop - headerOffset

      updateActiveHeading(id)
      setIsExpanded(false)

      requestAnimationFrame(() => {
        mainScrollContainer.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
      })
    }
  }

  return createPortal(
    <TocFloatingPanel
      activeHeading={activeHeading}
      activeId={activeId}
      articleContent={articleContent}
      direction={direction}
      headings={headings}
      isExpanded={isExpanded}
      reduceMotion={reduceMotion}
      scrollContainerRef={scrollContainerRef}
      onClose={() => setIsExpanded(false)}
      onLinkClick={handleLinkClick}
      onToggle={handleTocToggleClick}
    />,
    container,
  )
}
