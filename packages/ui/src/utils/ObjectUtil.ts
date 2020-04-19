export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const copy = { ...obj }
  for (const key of keys) {
    delete copy[key]
  }
  return copy
}

export const bind = (self: any): void => {
  for (const key of Reflect.ownKeys(self.constructor.prototype)) {
    if (key === 'constructor') {
      continue
    }
    const descriptor = Reflect.getOwnPropertyDescriptor(
      self.constructor.prototype,
      key,
    )
    if (descriptor && typeof descriptor.value === 'function') {
      self[key] = self[key].bind(self)
    }
  }
}
