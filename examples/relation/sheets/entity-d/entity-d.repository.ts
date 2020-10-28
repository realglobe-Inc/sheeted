import { MongoDriver } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { EntityDSchema } from './entity-d.schema'

export const EntityDRepository = new MongoDriver(
  SheetNames.EntityD,
  EntityDSchema,
)
