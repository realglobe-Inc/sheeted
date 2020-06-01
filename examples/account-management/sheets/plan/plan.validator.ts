import { Validator, ValidationResult } from '@sheeted/core'

import { PlanEntity } from './plan.entity'

export const PlanValidator: Validator<PlanEntity> = (_ctx) => (
  input: Partial<PlanEntity>,
): ValidationResult => {
  const result = new ValidationResult<PlanEntity>()
  if (input?.price ?? Infinity < 0) {
    result.appendError({
      field: 'price',
      message: 'Invalid price',
    })
  }
  if (input.price && !Number.isInteger(input.price)) {
    result.appendError({
      field: 'price',
      message: 'Invalid price',
    })
  }
  return result
}
