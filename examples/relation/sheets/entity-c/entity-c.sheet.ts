import { Sheet } from '@sheeted/core'

import { SheetNames, Role } from '../../constants'

import { EntityCEntity } from './entity-c.entity'
import { EntityCSchema } from './entity-c.schema'
import { EntityCValidator } from './entity-c.validator'
import { EntityCView } from './entity-c.view'
import { EntityCAccessPolicies } from './entity-c.access-policies'
import { EntityCActions } from './entity-c.actions'
import { EntityCHook } from './entity-c.hook'

export const EntityCSheet: Sheet<EntityCEntity, Role> = {
  name: SheetNames.EntityC,
  Schema: EntityCSchema,
  Validator: EntityCValidator,
  View: EntityCView,
  AccessPolicies: EntityCAccessPolicies,
  Actions: EntityCActions,
  Hook: EntityCHook,
}
