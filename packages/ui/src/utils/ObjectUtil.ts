export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const copy = { ...obj }
  for (const key of keys) {
    delete copy[key]
  }
  return copy
}

export const bind = (self: unknown): void => {
  if (typeof self !== 'object' || self === null) {
    console.warn('Cannot bind:', self)
    return
  }
  for (const key of Reflect.ownKeys(self.constructor.prototype)) {
    if (key === 'constructor') {
      continue
    }
    const descriptor = Reflect.getOwnPropertyDescriptor(
      self.constructor.prototype,
      key,
    )
    if (descriptor && typeof descriptor.value === 'function') {
      Reflect.set(self, key, descriptor.value.bind(self))
    }
  }
}
