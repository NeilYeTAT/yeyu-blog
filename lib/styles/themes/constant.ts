const brandThemeAttribute = 'data-brand-theme'

export const brandThemeOptions = [
  {
    id: 'mist',
    label: '雾薄荷',
    cssFile: 'mist.css',
  },
  {
    id: 'camellia',
    label: '茶花红',
    cssFile: 'camellia.css',
  },
  {
    id: 'leaf',
    label: '新叶绿',
    cssFile: 'leaf.css',
  },
] as const

export type BrandThemeId = (typeof brandThemeOptions)[number]['id']

export const defaultBrandTheme: BrandThemeId = 'mist'

const brandThemeIds = brandThemeOptions.map(option => option.id)

export function getRandomBrandTheme(): BrandThemeId {
  const randomIndex = Math.floor(Math.random() * brandThemeIds.length)
  return brandThemeIds[randomIndex]!
}

function isBrandThemeId(value: string | null): value is BrandThemeId {
  return value != null && brandThemeIds.includes(value as BrandThemeId)
}

function getDomBrandTheme(): BrandThemeId | null {
  if (typeof document === 'undefined') return null
  const raw = document.documentElement.getAttribute(brandThemeAttribute)
  return isBrandThemeId(raw) ? raw : null
}

export function applyBrandTheme(theme: BrandThemeId) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute(brandThemeAttribute, theme)
}

export function setBrandTheme(theme: BrandThemeId) {
  applyBrandTheme(theme)
}

export function resolveBrandTheme(): BrandThemeId {
  return getDomBrandTheme() ?? defaultBrandTheme
}
