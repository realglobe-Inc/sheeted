import { AccessPolicy } from '@sheeted/core'

import { Role, Roles } from '../../constants'

import { AccountEntity } from './account.entity'

export const AccountAccessPolicies: AccessPolicy<AccountEntity, Role>[] = [
  {
    action: 'read',
    role: Roles.DEFAULT_ROLE,
  },
  {
    action: 'create',
    role: Roles.DEFAULT_ROLE,
  },
]
