import { Validator, ValidationResult } from '@sheeted/core'

import { EntityDEntity } from './entity-d.entity'

export const EntityDValidator: Validator<EntityDEntity> = (_ctx) => (
  input: Partial<EntityDEntity>,
  current: EntityDEntity | null,
): ValidationResult<EntityDEntity> => {
  const result = new ValidationResult<EntityDEntity>()
  // entity can have only one field of cascade, restrict, or setNull
  const merged: Partial<EntityDEntity> = {
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
