const minutesPerHour = 60
const minutesPerDay = 24 * minutesPerHour

const skyFrames = [
  {
    cloudBrightness: 0.42,
    cloudHueRotate: -14,
    cloudOpacity: 0.24,
    cloudSaturate: 0.72,
    minutes: 0,
    phase: 'midnight',
    skyBottom: '#17244f',
    skyLower: '#101d42',
    skyMiddle: '#091935',
    skyTop: '#020713',
    skyUpper: '#05112a',
    starOpacity: 0.95,
    upperGlowColor: '#122f67',
    upperGlowOpacity: 0.2,
    warmGlowColor: '#3d4e85',
    warmGlowOpacity: 0,
  },
  {
    cloudBrightness: 0.62,
    cloudHueRotate: -8,
    cloudOpacity: 0.42,
    cloudSaturate: 0.86,
    minutes: 300,
    phase: 'dawn',
    skyBottom: '#f4a66e',
    skyLower: '#d5747f',
    skyMiddle: '#636ead',
    skyTop: '#182d63',
    skyUpper: '#294b88',
    starOpacity: 0.28,
    upperGlowColor: '#3866ac',
    upperGlowOpacity: 0.32,
    warmGlowColor: '#ffad62',
    warmGlowOpacity: 0.68,
  },
  {
    cloudBrightness: 0.92,
    cloudHueRotate: 0,
    cloudOpacity: 0.78,
    cloudSaturate: 1,
    minutes: 480,
    phase: 'morning',
    skyBottom: '#c9f4fb',
    skyLower: '#99e8f9',
    skyMiddle: '#6bd1f7',
    skyTop: '#8bddfa',
    skyUpper: '#75d4f8',
    starOpacity: 0,
    upperGlowColor: '#94e5fb',
    upperGlowOpacity: 0.3,
    warmGlowColor: '#ffc06d',
    warmGlowOpacity: 0.28,
  },
  {
    cloudBrightness: 1,
    cloudHueRotate: 0,
    cloudOpacity: 1,
    cloudSaturate: 1,
    minutes: 720,
    phase: 'noon',
    skyBottom: '#d9f8fb',
    skyLower: '#8ce1f7',
    skyMiddle: '#54c6f2',
    skyTop: '#66d8ff',
    skyUpper: '#5fcef8',
    starOpacity: 0,
    upperGlowColor: '#7ee4ff',
    upperGlowOpacity: 0.38,
    warmGlowColor: '#fff3bc',
    warmGlowOpacity: 0.06,
  },
  {
    cloudBrightness: 0.96,
    cloudHueRotate: -1,
    cloudOpacity: 0.84,
    cloudSaturate: 0.98,
    minutes: 960,
    phase: 'afternoon',
    skyBottom: '#c6eef9',
    skyLower: '#84d9f2',
    skyMiddle: '#53bfeb',
    skyTop: '#79d2f6',
    skyUpper: '#62c8f2',
    starOpacity: 0,
    upperGlowColor: '#78dcf8',
    upperGlowOpacity: 0.25,
    warmGlowColor: '#ffc06b',
    warmGlowOpacity: 0.16,
  },
  {
    cloudBrightness: 0.82,
    cloudHueRotate: -8,
    cloudOpacity: 0.68,
    cloudSaturate: 0.95,
    minutes: 1110,
    phase: 'sunset',
    skyBottom: '#ffd088',
    skyLower: '#f28b6b',
    skyMiddle: '#a55e9c',
    skyTop: '#31579b',
    skyUpper: '#5f70b9',
    starOpacity: 0.08,
    upperGlowColor: '#6e7acf',
    upperGlowOpacity: 0.24,
    warmGlowColor: '#ff9658',
    warmGlowOpacity: 0.86,
  },
  {
    cloudBrightness: 0.48,
    cloudHueRotate: -12,
    cloudOpacity: 0.32,
    cloudSaturate: 0.76,
    minutes: 1260,
    phase: 'night',
    skyBottom: '#1b2b57',
    skyLower: '#101f45',
    skyMiddle: '#0b1b39',
    skyTop: '#061026',
    skyUpper: '#0a1733',
    starOpacity: 0.78,
    upperGlowColor: '#17346d',
    upperGlowOpacity: 0.22,
    warmGlowColor: '#4d5d94',
    warmGlowOpacity: 0.04,
  },
  {
    cloudBrightness: 0.42,
    cloudHueRotate: -14,
    cloudOpacity: 0.24,
    cloudSaturate: 0.72,
    minutes: minutesPerDay,
    phase: 'midnight',
    skyBottom: '#17244f',
    skyLower: '#101d42',
    skyMiddle: '#091935',
    skyTop: '#020713',
    skyUpper: '#05112a',
    starOpacity: 0.95,
    upperGlowColor: '#122f67',
    upperGlowOpacity: 0.2,
    warmGlowColor: '#3d4e85',
    warmGlowOpacity: 0,
  },
] as const

export const getMinutesOfDay = (date: Date) => {
  return date.getHours() * minutesPerHour + date.getMinutes()
}

export const formatMinutesOfDay = (minutesOfDay: number) => {
  const normalizedMinutesOfDay = normalizeMinutesOfDay(minutesOfDay)
  const hours = Math.floor(normalizedMinutesOfDay / minutesPerHour)
  const minutes = normalizedMinutesOfDay % minutesPerHour

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

export const getSkyBackgroundTimeState = (minutesOfDay: number) => {
  const normalizedMinutesOfDay = normalizeMinutesOfDay(minutesOfDay)
  const currentFrameIndex = skyFrames.findIndex((frame, index) => {
    const nextFrame = skyFrames[index + 1]

    return nextFrame
      ? normalizedMinutesOfDay >= frame.minutes && normalizedMinutesOfDay < nextFrame.minutes
      : false
  })
  const currentFrame = skyFrames[currentFrameIndex]
  const nextFrame = skyFrames[currentFrameIndex + 1]
  const phaseProgress =
    (normalizedMinutesOfDay - currentFrame.minutes) / (nextFrame.minutes - currentFrame.minutes)

  return {
    cloudBrightness: interpolateNumber(
      currentFrame.cloudBrightness,
      nextFrame.cloudBrightness,
      phaseProgress,
    ),
    cloudHueRotate: interpolateNumber(
      currentFrame.cloudHueRotate,
      nextFrame.cloudHueRotate,
      phaseProgress,
    ),
    cloudOpacity: interpolateNumber(
      currentFrame.cloudOpacity,
      nextFrame.cloudOpacity,
      phaseProgress,
    ),
    cloudSaturate: interpolateNumber(
      currentFrame.cloudSaturate,
      nextFrame.cloudSaturate,
      phaseProgress,
    ),
    label: formatMinutesOfDay(normalizedMinutesOfDay),
    minutesOfDay: normalizedMinutesOfDay,
    nextPhase: nextFrame.phase,
    phase: currentFrame.phase,
    skyBottom: interpolateColor(currentFrame.skyBottom, nextFrame.skyBottom, phaseProgress),
    skyLower: interpolateColor(currentFrame.skyLower, nextFrame.skyLower, phaseProgress),
    skyMiddle: interpolateColor(currentFrame.skyMiddle, nextFrame.skyMiddle, phaseProgress),
    skyTop: interpolateColor(currentFrame.skyTop, nextFrame.skyTop, phaseProgress),
    skyUpper: interpolateColor(currentFrame.skyUpper, nextFrame.skyUpper, phaseProgress),
    starOpacity: interpolateNumber(currentFrame.starOpacity, nextFrame.starOpacity, phaseProgress),
    upperGlowOpacity: interpolateNumber(
      currentFrame.upperGlowOpacity,
      nextFrame.upperGlowOpacity,
      phaseProgress,
    ),
    upperGlowRgb: interpolateRgbChannels(
      currentFrame.upperGlowColor,
      nextFrame.upperGlowColor,
      phaseProgress,
    ),
    warmGlowOpacity: interpolateNumber(
      currentFrame.warmGlowOpacity,
      nextFrame.warmGlowOpacity,
      phaseProgress,
    ),
    warmGlowRgb: interpolateRgbChannels(
      currentFrame.warmGlowColor,
      nextFrame.warmGlowColor,
      phaseProgress,
    ),
  }
}

const normalizeMinutesOfDay = (minutesOfDay: number) => {
  const roundedMinutesOfDay = Math.round(minutesOfDay)

  return ((roundedMinutesOfDay % minutesPerDay) + minutesPerDay) % minutesPerDay
}

const interpolateNumber = (from: number, to: number, progress: number) => {
  return from + (to - from) * progress
}

const interpolateColor = (from: string, to: string, progress: number) => {
  const [fromRed, fromGreen, fromBlue] = hexToRgb(from)
  const [toRed, toGreen, toBlue] = hexToRgb(to)

  return rgbToHex(
    interpolateNumber(fromRed, toRed, progress),
    interpolateNumber(fromGreen, toGreen, progress),
    interpolateNumber(fromBlue, toBlue, progress),
  )
}

const interpolateRgbChannels = (from: string, to: string, progress: number) => {
  const [red, green, blue] = hexToRgb(interpolateColor(from, to, progress))

  return `${red} ${green} ${blue}`
}

const hexToRgb = (hex: string) => {
  return [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ]
}

const rgbToHex = (red: number, green: number, blue: number) => {
  return `#${toHexChannel(red)}${toHexChannel(green)}${toHexChannel(blue)}`
}

const toHexChannel = (channel: number) => {
  return Math.round(channel).toString(16).padStart(2, '0')
}
