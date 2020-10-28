import { MongoDriver } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { EntityBSchema } from './entity-b.schema'

export const EntityBRepository = new MongoDriver(
  SheetNames.EntityB,
  EntityBSchema,
)
