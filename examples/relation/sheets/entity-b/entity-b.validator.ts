import { Validator, ValidationResult } from '@sheeted/core'

import { EntityBEntity } from './entity-b.entity'

export const EntityBValidator: Validator<EntityBEntity> = (_ctx) => (
  input: Partial<EntityBEntity>,
  current: EntityBEntity | null,
): ValidationResult<EntityBEntity> => {
  const result = new ValidationResult<EntityBEntity>()
  // entity can have only one field of cascade, restrict, or setNull
  const merged: Partial<EntityBEntity> = {
    ...(current || {}),
    ...input,
  }
  const hasCascade = Boolean(merged.cascade)
  const hasRestrict = Boolean(merged.restrict)
  const hasSetNull = Boolean(merged.setNull)
  if ([hasCascade, hasRestrict, hasSetNull].filter(Boolean).length !== 1) {
    result.appendError({
      field: 'cascade',
      message: 'can have only 1 field',
    })
    result.appendError({
      field: 'restrict',
      message: 'can have only 1 field',
    })
    result.appendError({
      field: 'setNull',
      message: 'can have only 1 field',
    })
  }
  return result
}
