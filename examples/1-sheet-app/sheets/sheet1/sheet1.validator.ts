import { Validator, ValidationResult } from '@sheeted/core'

import { Sheet1Entity } from './sheet1.entity'

export const Sheet1Validator: Validator<Sheet1Entity> = (_ctx) => (
  input: Partial<Sheet1Entity>,
  _current: Sheet1Entity | null,
): ValidationResult => {
  const result = new ValidationResult<Sheet1Entity>()
  const nameLength = input?.name?.length ?? 0
  if (nameLength <= 1) {
    result.appendError({
      field: 'name',
      message: 'Too short',
    })
  }
  if (input.integer && !Number.isInteger(input.integer)) {
    result.appendError({
      field: 'integer',
      message: 'Must be integer',
    })
  }
  return result
}
