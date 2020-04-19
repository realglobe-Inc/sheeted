import { AccessPolicy } from '@sheeted/core'

import { Role, Roles } from '../../constants'

import { AggregationEntity } from './aggregation.entity'

export const AggregationAccessPolicies: AccessPolicy<
  AggregationEntity,
  Role
>[] = [
  {
    action: 'read',
    role: Roles.DEFAULT_ROLE,
  },
]
