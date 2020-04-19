import { AccessPolicy } from '@sheeted/core'

import { Roles, Role } from '../../constants'

import { Sheet1Entity } from './sheet1.entity'

export const Sheet1AccessPolicies: AccessPolicy<Sheet1Entity, Role>[] = [
  {
    action: 'read',
    role: Roles.DEFAULT_ROLE,
  },
  {
    action: 'create',
    role: Roles.EDITOR_ROLE,
    uneditableColumns: ['integer'],
  },
  {
    action: 'update',
    role: Roles.EDITOR_ROLE,
    uneditableColumns: ['plan'],
  },
]
