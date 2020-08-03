import { AccessPolicy, DefaultIAMRoles } from '@sheeted/core'

import { Role } from '../../constants'

import { EntityCEntity } from './entity-c.entity'

export const EntityCAccessPolicies: AccessPolicy<EntityCEntity, Role>[] = [
  {
    action: 'read',
    role: DefaultIAMRoles.DEFAULT_ROLE,
  },
  {
    action: 'create',
    role: DefaultIAMRoles.DEFAULT_ROLE,
  },
  {
    action: 'update',
    role: DefaultIAMRoles.DEFAULT_ROLE,
  },
  {
    action: 'delete',
    role: DefaultIAMRoles.DEFAULT_ROLE,
  },
]
