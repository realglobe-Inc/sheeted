import { Validator, ValidationResult } from '@sheeted/core'

import { BookEntity } from './book.entity'

export const BookValidator: Validator<BookEntity> = (_ctx) => (
  input: Partial<BookEntity>,
  _current: BookEntity | null,
): ValidationResult<BookEntity> => {
  const result = new ValidationResult<BookEntity>()
  if (input.price) {
    if (!Number.isInteger(input.price)) {
      result.appendError({
        field: 'price',
        message: 'Must be integer',
      })
    }
    if (input.price < 0) {
      result.appendError({
        field: 'price',
        message: 'Must be greater than or equal to 0',
      })
    }
  }
  return result
}
