import { Validator, ValidationResult } from '@sheeted/core'

import { ExampleEntity } from './example.entity'

export const ExampleValidator: Validator<ExampleEntity> = (_ctx) => (
  input: Partial<ExampleEntity>,
  _current: ExampleEntity | null,
): ValidationResult<ExampleEntity> => {
  const result = new ValidationResult<ExampleEntity>()
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
