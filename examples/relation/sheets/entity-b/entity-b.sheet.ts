import { Sheet } from '@sheeted/core'

import { Role, SheetNames } from '../../constants'

import { EntityBEntity } from './entity-b.entity'
import { EntityBSchema } from './entity-b.schema'
import { EntityBValidator } from './entity-b.validator'
import { EntityBView } from './entity-b.view'
import { EntityBAccessPolicies } from './entity-b.access-policies'
import { EntityBActions } from './entity-b.actions'
import { EntityBHook } from './entity-b.hook'

export const EntityBSheet: Sheet<EntityBEntity, Role> = {
  name: SheetNames.EntityB,
  Schema: EntityBSchema,
  Validator: EntityBValidator,
  View: EntityBView,
  AccessPolicies: EntityBAccessPolicies,
  Actions: EntityBActions,
  Hook: EntityBHook,
}
