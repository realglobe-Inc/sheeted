import { DefaultIAMRoles, DefaultIAMRole } from '@sheeted/core'

export const PlanNames = ['free', 'basic', 'premium', 'canceled'] as const

export type PlanName = typeof PlanNames[number]

export const SheetNames = {
  ACCOUNT_SHEET: 'Account',
  ACCOUNT_PLAN_SHEET: 'AccountPlan',
  PLAN_SHEET: 'Plan',
}

export type Role = DefaultIAMRole

export const Roles = DefaultIAMRoles

export const RoleLabels = [
  { value: DefaultIAMRoles.ADMIN_ROLE, label: 'Admin' },
  { value: DefaultIAMRoles.DEFAULT_ROLE, label: 'User' },
] as const
