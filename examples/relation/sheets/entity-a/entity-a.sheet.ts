import { Sheet } from '@sheeted/core'

import { Role, SheetNames } from '../../constants'

import { EntityAEntity } from './entity-a.entity'
import { EntityASchema } from './entity-a.schema'
import { EntityAValidator } from './entity-a.validator'
import { EntityAView } from './entity-a.view'
import { EntityAAccessPolicies } from './entity-a.access-policies'
import { EntityAActions } from './entity-a.actions'
import { EntityAHook } from './entity-a.hook'

export const EntityASheet: Sheet<EntityAEntity, Role> = {
  name: SheetNames.EntityA,
  Schema: EntityASchema,
  Validator: EntityAValidator,
  View: EntityAView,
  AccessPolicies: EntityAAccessPolicies,
  Actions: EntityAActions,
  Hook: EntityAHook,
}
