import { Sheet } from '@sheeted/core'

import { SheetNames, Role } from '../../constants'

import { EntityDEntity } from './entity-d.entity'
import { EntityDSchema } from './entity-d.schema'
import { EntityDValidator } from './entity-d.validator'
import { EntityDView } from './entity-d.view'
import { EntityDAccessPolicies } from './entity-d.access-policies'
import { EntityDActions } from './entity-d.actions'
import { EntityDHook } from './entity-d.hook'

export const EntityDSheet: Sheet<EntityDEntity, Role> = {
  name: SheetNames.EntityD,
  Schema: EntityDSchema,
  Validator: EntityDValidator,
  View: EntityDView,
  AccessPolicies: EntityDAccessPolicies,
  Actions: EntityDActions,
  Hook: EntityDHook,
}
