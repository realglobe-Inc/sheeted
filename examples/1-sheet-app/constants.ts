import { DefaultIAMRole, DefaultIAMRoles } from '@sheeted/core'

export const Colors = ['red', 'blue', 'green', 'white', 'black'] as const
export const PlanNames = ['free', 'basic'] as const

export type Color = typeof Colors[number]
export type PlanName = typeof PlanNames[number]

export const SheetNames = {
  SHEET1: 'Sheet1',
}

export type Role = DefaultIAMRole | 'editor'
export const Roles = {
  ...DefaultIAMRoles,
  EDITOR_ROLE: 'editor',
} as const
