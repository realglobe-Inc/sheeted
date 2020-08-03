import { AccessPolicy, DefaultIAMRoles } from '@sheeted/core'

import { Role } from '../../constants'

import { EntityBEntity } from './entity-b.entity'

export const EntityBAccessPolicies: AccessPolicy<EntityBEntity, Role>[] = [
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
