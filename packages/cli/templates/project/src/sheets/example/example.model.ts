import { compileModel } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { ExampleSchema } from './example.schema'
import { ExampleEntity } from './example.entity'

export const ExampleModel = compileModel<ExampleEntity>(
  SheetNames.Example,
  ExampleSchema,
)
