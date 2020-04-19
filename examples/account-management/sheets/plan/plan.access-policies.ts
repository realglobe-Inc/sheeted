import { AccessPolicy } from '@sheeted/core'

import { Role, Roles } from '../../constants'

import { PlanEntity } from './plan.entity'

export const PlanAccessPolicies: AccessPolicy<PlanEntity, Role>[] = [
  {
    action: 'read',
    role: Roles.DEFAULT_ROLE,
  },
]
