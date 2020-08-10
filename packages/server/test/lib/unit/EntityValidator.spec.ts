import '../../tools/typings'
import mongoose from 'mongoose'
import { Schema, Types, ValidationResult, Validate } from '@sheeted/core'
import { MongoDriver, compileModel } from '@sheeted/mongoose'

import { connectMongo } from '../../tools/mongoose'
import { EntityValidator } from '../../../src/controllers/concern/EntityValidator'
import { EntityConverter } from '../../../src/controllers/concern/EntityConverter'

type Entity = {
  greaterThan0: number
  greaterThanLast: number
  readonly: number
  optional: number
  uniq: string
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
  uniq: {
    type: Types.Text,
    unique: true,
    optional: true,
  },
}
const model = compileModel('validator', schema)
const repository = new MongoDriver('validator_entity', schema)

beforeAll(async () => {
  await connectMongo()
})

afterAll(async () => {
  await mongoose.disconnect()
})

beforeEach(async () => {
  await model.deleteMany({})
})

test('EntityValidator', async () => {
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
  const converter: EntityConverter = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    beforeSave: (e: any) => e,
  } as any
  const validator = new EntityValidator(schema, validate, repository, converter)

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

  await repository.create({ uniq: 'dup' })
  await expect(
    validator.validate(
      {
        greaterThan0: 1,
        greaterThanLast: 0,
        uniq: 'a',
      },
      null,
    ),
  ).resolves.toBeUndefined()
  await expect(
    validator.validate(
      {
        greaterThan0: 1,
        greaterThanLast: 0,
        uniq: 'dup',
      },
      null,
    ),
  ).rejects.toMatchObject({
    errors: [
      {
        message: 'Duplicate value',
        field: 'uniq',
      },
    ],
  })
  await expect(
    validator.validate(
      {
        greaterThan0: 1,
        greaterThanLast: 0,
        uniq: null,
      },
      {
        uniq: 'b',
      },
    ),
  ).resolves.toBeUndefined()
})
