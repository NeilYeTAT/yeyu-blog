// * thanks https://github.com/antfu/antfu.me/blob/main/src/components/ArtPlum.vue
'use client'

import { useEffect, useRef } from 'react'
import { useIsAnimationComplete } from '@/store/use-startup-store'

const r180 = Math.PI
const r90 = Math.PI / 2
const r15 = Math.PI / 12
const color = '#88888825'

const { random } = Math

export const ArtPlum = () => {
  const isAnimationComplete = useIsAnimationComplete()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stepsRef = useRef<Array<() => void>>([])
  const prevStepsRef = useRef<Array<() => void>>([])
  const len = useRef(6)
  const stopped = useRef(false)

  useEffect(() => {
    if (!isAnimationComplete) return

    const canvas = canvasRef.current
    if (canvas == null) return
    let requestId: number | undefined

    const size = { width: window.innerWidth, height: window.innerHeight }

    const initCanvas = (canvas: HTMLCanvasElement, width = 400, height = 400) => {
      const ctx = canvas.getContext('2d')!
      const dpi = Math.min(window.devicePixelRatio, 1.5)

      canvas.style.cssText = `width: ${width}px; height: ${height}px;`
      canvas.width = Math.round(dpi * width)
      canvas.height = Math.round(dpi * height)
      ctx.scale(dpi, dpi)

      return { ctx }
    }

    const { ctx } = initCanvas(canvas, size.width, size.height)
    const { width, height } = canvas

    const polar2cart = (x = 0, y = 0, r = 0, theta = 0) => {
      const dx = r * Math.cos(theta)
      const dy = r * Math.sin(theta)
      return [x + dx, y + dy]
    }

    const step = (x: number, y: number, rad: number, counter: { value: number } = { value: 0 }) => {
      const length = random() * len.current
      counter.value += 1

      const [nx, ny] = polar2cart(x, y, length, rad)

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(nx, ny)
      ctx.stroke()

      const rad1 = rad + random() * r15
      const rad2 = rad - random() * r15

      // out of bounds
      if (nx < -100 || nx > size.width + 100 || ny < -100 || ny > size.height + 100) return

      const minBranch = 30
      const rate = counter.value <= minBranch ? 0.8 : 0.5

      // left branch
      if (random() < rate) stepsRef.current.push(() => step(nx, ny, rad1, counter))

      // right branch
      if (random() < rate) stepsRef.current.push(() => step(nx, ny, rad2, counter))
    }

    let lastTime = performance.now()
    const interval = 1000 / 40

    const frame = () => {
      if (performance.now() - lastTime < interval) {
        requestId = requestAnimationFrame(frame)
        return
      }

      prevStepsRef.current = stepsRef.current
      stepsRef.current = []
      lastTime = performance.now()

      if (prevStepsRef.current.length === 0) {
        stopped.current = true
        return
      }

      prevStepsRef.current.forEach(i => {
        if (random() < 0.5) stepsRef.current.push(i)
        else i()
      })

      requestId = requestAnimationFrame(frame)
    }

    const randomMiddle = () => random() * 0.6 + 0.2

    const start = () => {
      if (requestId !== undefined) cancelAnimationFrame(requestId)
      ctx.clearRect(0, 0, width, height)
      ctx.lineWidth = 1
      ctx.strokeStyle = color
      prevStepsRef.current = []
      stepsRef.current = [
        () => step(randomMiddle() * size.width, -5, r90),
        () => step(randomMiddle() * size.width, size.height + 5, -r90),
        () => step(-5, randomMiddle() * size.height, 0),
        () => step(size.width + 5, randomMiddle() * size.height, r180),
      ]
      if (size.width < 500) stepsRef.current = stepsRef.current.slice(0, 2)

      stopped.current = false
      requestId = requestAnimationFrame(frame)
    }

    start()

    return () => {
      if (requestId !== undefined) cancelAnimationFrame(requestId)
    }
  }, [isAnimationComplete])

  const mask = 'radial-gradient(circle, transparent, black)'

  return (
    <div
      className="pointer-events-none fixed top-0 right-0 bottom-0 left-0 print:hidden"
      style={{
        zIndex: -20,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      <canvas ref={canvasRef} width="400" height="400" />
    </div>
  )
}
