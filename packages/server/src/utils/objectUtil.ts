import assert from 'assert'

/**
 * Drop undefined properties recursively
 */
export const dropUndef = <T>(obj: T): T => {
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      dropUndef(obj[key])
    }
    if (obj[key] === undefined) {
      delete obj[key]
    }
  }
  return obj
}

/**
 * Returns true if the first object equals to the second object or false if not
 */
export const equals = (a: unknown, b: unknown): boolean => {
  try {
    assert.deepEqual(a, b)
    return true
  } catch (e) {
    return false
  }
}
