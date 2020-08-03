import { Validator, ValidationResult } from '@sheeted/core'

import { EntityCEntity } from './entity-c.entity'

export const EntityCValidator: Validator<EntityCEntity> = (_ctx) => (
  _input: Partial<EntityCEntity>,
  _current: EntityCEntity | null,
): ValidationResult<EntityCEntity> => {
  const result = new ValidationResult<EntityCEntity>()
  return result
}
