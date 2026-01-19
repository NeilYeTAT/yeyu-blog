// * thanks https://github.com/antfu/antfu.me/blob/main/src/components/ArtPlum.vue
'use client'

import { useEffect, useRef } from 'react'

const r180 = Math.PI
const r90 = Math.PI / 2
const r15 = Math.PI / 12
const color = '#88888825'

const { random } = Math

export const ArtPlum = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number | undefined>(undefined)
  const stepsRef = useRef<Array<() => void>>([])
  const prevStepsRef = useRef<Array<() => void>>([])
  const len = useRef(6)
  const stopped = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas == null) return

    const size = { width: window.innerWidth, height: window.innerHeight }

    const initCanvas = (canvas: HTMLCanvasElement, width = 400, height = 400, _dpi?: number) => {
      const ctx = canvas.getContext('2d')!
      const dpr = window.devicePixelRatio ?? 1

      const bsr =
        // @ts-expect-error don't worry
        ctx?.webkitBackingStorePixelRatio ??
        // @ts-expect-error don't worry
        ctx?.mozBackingStorePixelRatio ??
        // @ts-expect-error don't worry
        ctx?.msBackingStorePixelRatio ??
        // @ts-expect-error don't worry
        ctx?.oBackingStorePixelRatio ??
        // @ts-expect-error don't worry
        ctx?.backingStorePixelRatio ??
        1
      const dpi = _dpi ?? dpr / bsr

      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      canvas.width = dpi * width
      canvas.height = dpi * height
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

      const MIN_BRANCH = 30
      const rate = counter.value <= MIN_BRANCH ? 0.8 : 0.5

      // left branch
      if (random() < rate) stepsRef.current.push(() => step(nx, ny, rad1, counter))

      // right branch
      if (random() < rate) stepsRef.current.push(() => step(nx, ny, rad2, counter))
    }

    let lastTime = performance.now()
    const interval = 1000 / 40 // 50fps

    const frame = () => {
      if (performance.now() - lastTime < interval) {
        requestRef.current = requestAnimationFrame(frame)
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

      requestRef.current = requestAnimationFrame(frame)
    }

    const randomMiddle = () => random() * 0.6 + 0.2

    const start = () => {
      if (requestRef.current !== undefined) cancelAnimationFrame(requestRef.current)
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
      requestRef.current = requestAnimationFrame(frame)
    }

    start()

    return () => {
      if (requestRef.current !== undefined) cancelAnimationFrame(requestRef.current)
    }
  }, [])

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
