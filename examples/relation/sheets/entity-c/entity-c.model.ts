import { compileModel } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { EntityCSchema } from './entity-c.schema'
import { EntityCEntity } from './entity-c.entity'

export const EntityCModel = compileModel<EntityCEntity>(
  SheetNames.EntityC,
  EntityCSchema,
)
