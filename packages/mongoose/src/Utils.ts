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

/** @internal */
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
      copy[key] = castObjectIdOrNull(subEntity.id)
    }
  }
  return copy
}

/** @internal */
export const castObjectIdOrNull = (id: string): MongoTypes.ObjectId | null => {
  try {
    return MongoTypes.ObjectId.createFromHexString(id)
  } catch (e) {
    console.warn(`[WARNING] Cannot cast string "${id}" to Mongo Object ID.`)
    return null
  }
}

/** @internal */
export const replaceId = (input: Record<string, any>): Record<string, any> => {
  let _input = { ...input }
  // id を _id にすり替える
  if (_input.id) {
    _input = {
      ..._input,
      _id: _input.id,
    }
    delete _input.id
  }
  return _input
}

/**
 * Create ID string of an entity
 */
export const createEntityId = (number?: number): string =>
  typeof number === 'number'
    ? MongoTypes.ObjectId.createFromTime(number).toHexString()
    : MongoTypes.ObjectId().toHexString()
