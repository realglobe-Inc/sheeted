import { DefaultIAMRole, DefaultIAMRoles } from '@sheeted/core'

export const SheetNames = {
  EntityA: 'EntityA',
  EntityB: 'EntityB',
  EntityC: 'EntityC',
  EntityD: 'EntityD',
}

export type Role = DefaultIAMRole
export const Roles = DefaultIAMRoles

export const RoleLabels = [
  {
    label: 'Admin',
    value: Roles.ADMIN_ROLE,
  },
  {
    label: 'Default',
    value: Roles.DEFAULT_ROLE,
  },
]
