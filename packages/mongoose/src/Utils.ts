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
