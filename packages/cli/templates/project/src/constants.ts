import { DefaultIAMRole, DefaultIAMRoles } from '@sheeted/core'

export const SheetNames = {
  Example: 'Example',
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
