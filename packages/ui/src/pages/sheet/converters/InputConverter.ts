import { Column } from '@sheeted/core/build/web/Shared.type'

import { Entity } from '../../../types/Entity.type'

const diff = (newEntity: Entity, oldEntity: Entity | null) => {
  const changes: any = {}
  for (const field of Object.keys(newEntity)) {
    if (field.startsWith('$')) {
      // meta fields
      continue
    }
    const isEqual =
      JSON.stringify(newEntity[field]) === JSON.stringify(oldEntity?.[field])
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
): any => {
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
