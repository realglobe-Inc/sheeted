import { DefaultIAMRole, DefaultIAMRoles } from '@sheeted/core'

export const SheetNames = {
  PROJECT_SHEET: 'Project',
  REPORT_SHEET: 'Report',
  AGGREGATION_SHEET: 'Aggragation',
}

export type Role = DefaultIAMRole
export const Roles = {
  ...DefaultIAMRoles,
} as const
export const RoleLabels = [
  { value: DefaultIAMRoles.ADMIN_ROLE, label: 'Admin' },
  { value: DefaultIAMRoles.DEFAULT_ROLE, label: 'User' },
] as const
