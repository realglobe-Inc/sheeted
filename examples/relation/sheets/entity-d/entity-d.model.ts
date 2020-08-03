import { compileModel } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { EntityDSchema } from './entity-d.schema'
import { EntityDEntity } from './entity-d.entity'

export const EntityDModel = compileModel<EntityDEntity>(
  SheetNames.EntityD,
  EntityDSchema,
)
