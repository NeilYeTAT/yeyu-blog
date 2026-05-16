export function typedEntries<T extends Record<PropertyKey, unknown>>(obj: T) {
  return Object.entries(obj) as {
    [K in keyof T]: [K, T[K]]
  }[keyof T][]
}
