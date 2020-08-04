import { AccessPolicy, DefaultIAMRoles } from '@sheeted/core'

import { Role } from '../../constants'

import { EntityAEntity } from './entity-a.entity'

export const EntityAAccessPolicies: AccessPolicy<EntityAEntity, Role>[] = [
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
