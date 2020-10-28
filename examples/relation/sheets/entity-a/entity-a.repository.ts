import { MongoDriver } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { EntityASchema } from './entity-a.schema'

export const EntityARepository = new MongoDriver(
  SheetNames.EntityA,
  EntityASchema,
)
