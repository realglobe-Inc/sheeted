import { Validator, ValidationResult } from '@sheeted/core'

import { EntityAEntity } from './entity-a.entity'

export const EntityAValidator: Validator<EntityAEntity> = (_ctx) => (
  input: Partial<EntityAEntity>,
  _current: EntityAEntity | null,
): ValidationResult<EntityAEntity> => {
  const result = new ValidationResult<EntityAEntity>()
  if (input.name) {
    if (input.name.length < 2) {
      result.appendError({
        field: 'name',
        message: 'Must have length more than 1',
      })
    }
  }
  return result
}
