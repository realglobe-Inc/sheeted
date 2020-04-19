import { AccessPolicy } from '@sheeted/core'

import { Role, Roles } from '../../constants'

import { ReportEntity } from './report.entity'

export const ReportAccessPolicies: AccessPolicy<ReportEntity, Role>[] = [
  {
    action: 'read',
    role: Roles.DEFAULT_ROLE,
  },
  {
    action: 'create',
    role: Roles.DEFAULT_ROLE,
  },
  {
    action: 'update',
    role: Roles.DEFAULT_ROLE,
  },
  {
    action: 'delete',
    role: Roles.DEFAULT_ROLE,
  },
]
