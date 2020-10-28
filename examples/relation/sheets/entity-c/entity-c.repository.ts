import { MongoDriver } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { EntityCSchema } from './entity-c.schema'

export const EntityCRepository = new MongoDriver(
  SheetNames.EntityC,
  EntityCSchema,
)
