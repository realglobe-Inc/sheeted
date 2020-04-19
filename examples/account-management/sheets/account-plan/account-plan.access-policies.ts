import { AccessPolicy } from '@sheeted/core'

import { Roles, Role } from '../../constants'

import { AccountPlanEntity } from './account-plan.entity'

export const AccountPlanAccessPolicies: AccessPolicy<
  AccountPlanEntity,
  Role
>[] = [
  {
    action: 'read',
    role: Roles.DEFAULT_ROLE,
  },
  {
    action: 'create',
    role: Roles.DEFAULT_ROLE,
  },
]
