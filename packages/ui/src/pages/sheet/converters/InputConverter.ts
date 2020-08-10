import { Column } from '@sheeted/core/build/web/Shared.type'

import { Entity } from '../../../types/Entity.type'

const diff = (newEntity: Entity, oldEntity: Entity | null) => {
  const changes: Record<string, any> = {}
  for (const field of Object.keys(newEntity)) {
    if (field.startsWith('$')) {
      // meta fields
      continue
    }
    const newValue = newEntity[field]
    const oldValue = oldEntity?.[field]
    const isEqual =
      // object なら entity field である
      typeof newValue === 'object' && newValue !== null
        ? (newValue as Entity).id === ((oldValue || {}) as Entity).id
        : newValue === oldValue
    if (!isEqual) {
      changes[field] = newEntity[field]
    }
  }
  return changes
}

export const convertInput = (
  newEntity: Entity,
  oldEntity: Entity | null,
  columns: Column[],
): Record<string, any> => {
  const changes = diff(newEntity, oldEntity)
  for (const field of Object.keys(changes)) {
    const column = columns.find((column) => column.field === field)
    if (!column) {
      console.warn(`Not found column "${field}"`)
      continue
    }
    switch (column.form) {
      case 'number':
        changes[field] = Number(changes[field])
        continue
      default:
      // pass
    }
  }
  return changes
}
