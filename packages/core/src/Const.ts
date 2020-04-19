import { AccessPolicy } from './AccessPolicy.type'

export const IAM_USER_SHEET = 'IAMUsers'

export const DefaultIAMRoles = {
  ADMIN_ROLE: 'admin',
  DEFAULT_ROLE: 'default',
} as const

export type DefaultIAMRole = 'admin' | 'default'

export const AdminAccessPolicies: AccessPolicy<any, string>[] = [
  {
    action: 'read',
    role: DefaultIAMRoles.ADMIN_ROLE,
  },
  {
    action: 'create',
    role: DefaultIAMRoles.ADMIN_ROLE,
  },
  {
    action: 'update',
    role: DefaultIAMRoles.ADMIN_ROLE,
  },
  {
    action: 'delete',
    role: DefaultIAMRoles.ADMIN_ROLE,
  },
]
