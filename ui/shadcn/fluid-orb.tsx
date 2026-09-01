'use client'

import React, { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils/common/shadcn'

const vertexShaderSource = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const fragmentShaderSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.6;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time * 0.22;

  vec2 drift = vec2(
    sin(t) + 0.6 * sin(t * 1.7 + 1.3),
    cos(t * 0.8) + 0.6 * cos(t * 1.3 + 2.1)
  );

  vec2 p = vec2(uv.x * 1.8, uv.y * 1.0) + drift * 0.7;

  vec2 q = vec2(fbm(p + drift), fbm(p + vec2(3.2, 1.5) - drift));
  float f = fbm(p + 1.2 * q);

  float g = clamp(1.0 - uv.y, 0.0, 1.0);
  float anchor = smoothstep(0.0, 0.3, uv.y);
  float shade = clamp(g + (f - 0.5) * 0.8 * anchor, 0.0, 1.0);

  vec3 white = vec3(0.99, 1.0, 1.0);
  vec3 light = mix(white, u_color, 0.5);
  vec3 dark = u_color;

  vec3 col = white;
  col = mix(col, light, smoothstep(0.28, 0.52, shade));
  col = mix(col, dark, smoothstep(0.58, 0.88, shade));

  float edge = smoothstep(0.5, 0.49, distance(uv, vec2(0.5)));

  gl_FragColor = vec4(col * edge, edge);
}
`

function getRgbChannels(element: HTMLDivElement) {
  const [red, green, blue] = getComputedStyle(element)
    .color.match(/[\d.]+/g)!
    .slice(0, 3)
    .map(channel => Number(channel) / 255)

  return [red!, green!, blue!] as const
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

const FluidOrb = ({
  size = 240,
  color = 'var(--theme-accent)',
  maxDpr = 2,
  frameRate = 30,
  animationDuration = 1_200,
  animationPulse = 0,
  isAnimating = false,
  className,
  style,
  ...props
}: React.ComponentProps<'div'> & {
  size?: number
  color?: string
  maxDpr?: number
  frameRate?: number
  animationDuration?: number
  animationPulse?: number
  isAnimating?: boolean
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isAnimatingRef = useRef(isAnimating)
  const requestRenderingRef = useRef<((duration?: number) => void) | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const gl = canvas.getContext('webgl', { antialias: false, alpha: true })
    if (!gl) return

    const program = gl.createProgram()
    const vert = compile(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const frag = compile(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    if (!program || !vert || !frag) return

    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const aPos = gl.getAttribLocation(program, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uResolution = gl.getUniformLocation(program, 'u_resolution')
    const uTime = gl.getUniformLocation(program, 'u_time')
    const uColor = gl.getUniformLocation(program, 'u_color')
    gl.uniform3f(uColor, ...getRgbChannels(container))

    const dpr = Math.min(window.devicePixelRatio, maxDpr)
    const px = Math.round(size * dpr)
    canvas.width = px
    canvas.height = px
    gl.viewport(0, 0, px, px)
    gl.uniform2f(uResolution, px, px)

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const frameInterval = 1000 / frameRate
    let animationEndTime = 0
    let isIntersecting = false
    let previousRenderTime = 0
    let raf = 0
    let shaderTime = 0

    const stopRendering = () => {
      cancelAnimationFrame(raf)
      raf = 0
      previousRenderTime = 0
    }

    const canRender = () =>
      isIntersecting && document.visibilityState === 'visible'

    const render = (now: number) => {
      raf = 0

      if (!canRender()) {
        previousRenderTime = 0
        return
      }

      if (reducedMotionQuery.matches) {
        gl.uniform1f(uTime, 0)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
        return
      }

      if (previousRenderTime === 0) previousRenderTime = now - frameInterval
      const elapsedTime = now - previousRenderTime

      if (elapsedTime >= frameInterval) {
        previousRenderTime = now - (elapsedTime % frameInterval)
        shaderTime += Math.min(elapsedTime, frameInterval * 2) / 1000
        gl.uniform1f(uTime, shaderTime)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
      }

      if (isAnimatingRef.current || now < animationEndTime) {
        raf = requestAnimationFrame(render)
        return
      }

      previousRenderTime = 0
    }

    const requestRendering = (duration = 0) => {
      animationEndTime = Math.max(animationEndTime, performance.now() + duration)

      if (!canRender()) return

      if (reducedMotionQuery.matches) {
        stopRendering()
        render(performance.now())
        return
      }

      if (raf === 0) raf = requestAnimationFrame(render)
    }

    requestRenderingRef.current = requestRendering

    const observer = new IntersectionObserver(entries => {
      isIntersecting = entries[0]?.isIntersecting ?? false

      if (!isIntersecting) {
        stopRendering()
        return
      }

      requestRendering(animationDuration)
    })
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        stopRendering()
        return
      }

      requestRendering(animationDuration)
    }
    const handleReducedMotionChange = () => {
      stopRendering()
      requestRendering()
    }

    observer.observe(container)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange)

    return () => {
      requestRenderingRef.current = null
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange)
      stopRendering()
      gl.deleteProgram(program)
      gl.deleteShader(vert)
      gl.deleteShader(frag)
      gl.deleteBuffer(buffer)
    }
  }, [animationDuration, color, frameRate, maxDpr, size])

  useEffect(() => {
    isAnimatingRef.current = isAnimating
    requestRenderingRef.current?.(isAnimating ? 0 : animationDuration)
  }, [animationDuration, isAnimating])

  useEffect(() => {
    requestRenderingRef.current?.(animationDuration)
  }, [animationDuration, animationPulse])

  return (
    <div
      ref={containerRef}
      data-slot="fluid-orb"
      className={cn('relative overflow-hidden rounded-full', className)}
      style={{
        width: size,
        height: size,
        color,
        ...style,
      }}
      {...props}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}

export default FluidOrb
