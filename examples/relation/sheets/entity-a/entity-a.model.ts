import { compileModel } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { EntityASchema } from './entity-a.schema'
import { EntityAEntity } from './entity-a.entity'

export const EntityAModel = compileModel<EntityAEntity>(
  SheetNames.EntityA,
  EntityASchema,
)
