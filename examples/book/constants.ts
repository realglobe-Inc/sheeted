import { DefaultIAMRole, DefaultIAMRoles } from '@sheeted/core'

export const Genres = ['comic', 'novel'] as const
export const Formats = ['paper', 'kindle'] as const

export type Genre = typeof Genres[number]
export type Format = typeof Formats[number]

export const SheetNames = {
  BOOK: 'Book',
}

export type Role = DefaultIAMRole | 'editor'
export const Roles = {
  ...DefaultIAMRoles,
  EDITOR_ROLE: 'editor',
} as const

export const RoleLabels = [
  {
    label: '管理者',
    value: Roles.ADMIN_ROLE,
  },
  {
    label: '編集可',
    value: Roles.EDITOR_ROLE,
  },
  {
    label: '一般',
    value: Roles.DEFAULT_ROLE,
  },
]

export const ActionIds = {
  LIKE: 'like',
}
