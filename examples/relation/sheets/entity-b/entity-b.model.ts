import { compileModel } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { EntityBSchema } from './entity-b.schema'
import { EntityBEntity } from './entity-b.entity'

export const EntityBModel = compileModel<EntityBEntity>(
  SheetNames.EntityB,
  EntityBSchema,
)
