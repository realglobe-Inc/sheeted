import { MongoDriver } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { ExampleSchema } from './example.schema'

export const ExampleRepository = new MongoDriver(
  SheetNames.Example,
  ExampleSchema,
)
