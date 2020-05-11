import '../../tools/typings'
import { Schema, Types, ValidationResult, Validate } from '@sheeted/core'

import { EntityValidator } from '../../../src/controllers/concern/EntityValidator'

test('EntityValidator', async () => {
  type Entity = {
    greaterThan0: number
    greaterThanLast: number
    readonly: number
    optional: number
  }
  const schema: Schema<Entity> = {
    greaterThan0: {
      type: Types.Numeric,
    },
    greaterThanLast: {
      type: Types.Numeric,
    },
    readonly: {
      type: Types.Numeric,
      readonly: true,
    },
    optional: {
      type: Types.CalendarDate,
      optional: true,
    },
  }
  const validate: Validate<Entity> = (input, current) => {
    const result = new ValidationResult()
    if (input.greaterThan0! <= 0) {
      result.appendError({
        field: 'greaterThan0',
        message: 'invalid',
      })
    }
    if (current && input.greaterThanLast! <= current.greaterThanLast) {
      result.appendError({
        field: 'greaterThanLast',
        message: 'invalid',
      })
    }
    return result
  }
  const validator = new EntityValidator(schema, validate, null as any)

  await expect(
    validator.validate({}, { greaterThan0: 1, greaterThanLast: 1 }),
  ).resolves.toBeUndefined()
  await expect(
    validator.validate(
      {
        greaterThan0: 1,
        greaterThanLast: 1,
        optional: null,
      },
      null,
    ),
  ).resolves.toBeUndefined()
  await expect(
    validator.validate(
      {
        greaterThan0: 1,
        greaterThanLast: 1,
      },
      {
        greaterThanLast: 0,
      },
    ),
  ).resolves.toBeUndefined()
  await expect(
    validator.validate(
      {
        greaterThan0: -1,
        greaterThanLast: 0,
        readonly: 10,
      },
      {
        greaterThanLast: 1,
      },
    ),
  ).rejects.toMatchObject({
    errors: [
      { message: 'invalid', field: 'greaterThan0' },
      { message: 'invalid', field: 'greaterThanLast' },
      { message: 'Readonly field', field: 'readonly' },
    ],
  })
})
