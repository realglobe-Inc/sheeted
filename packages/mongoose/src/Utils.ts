import { Types as MongoTypes } from 'mongoose'

const INTERNAL_ID = '_id'
const INTERNAL_VERSION = '__v'

/**
 * @internal
 * 再帰的に _id, __v を削除する
 */
export const deleteMetaFields = (obj: Record<string, any> | null): void => {
  if (!obj) {
    return
  }
  for (const [key, value] of Object.entries(obj)) {
    if (key === INTERNAL_ID || key === INTERNAL_VERSION) {
      delete obj[key]
    }
    if (Array.isArray(value)) {
      value.forEach((v) => deleteMetaFields(v))
    }
    if (value && typeof value === 'object') {
      deleteMetaFields(value)
    }
  }
}

export const convertInput = (
  input: Record<string, any>,
): Record<string, any> => {
  if (!input) {
    return input
  }
  const copy = { ...input }
  for (const [key, value] of Object.entries(input)) {
    if (value && typeof value === 'object' && 'id' in value) {
      const subEntity: Record<string, any> = value
      copy[key] = objectIdOrNull(subEntity.id)
    }
  }
  return copy
}

export const objectIdOrNull = (id: string): MongoTypes.ObjectId | null => {
  try {
    return MongoTypes.ObjectId.createFromHexString(id)
  } catch (e) {
    return null
  }
}
