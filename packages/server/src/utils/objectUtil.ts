import assert from 'assert'

export const dropUndef = <T>(obj: T): T => {
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] === undefined) {
      delete obj[key]
    }
  }
  return obj
}

export const equals = (a: unknown, b: unknown): boolean => {
  try {
    assert.deepEqual(a, b)
    return true
  } catch (e) {
    return false
  }
}
