import { AccessPolicy } from '@sheeted/core'

import { Roles, Role, ActionIds } from '../../constants'

import { BookEntity } from './book.entity'

export const BookAccessPolicies: AccessPolicy<BookEntity, Role>[] = [
  {
    action: 'read',
    role: Roles.DEFAULT_ROLE,
  },
  {
    action: 'create',
    role: Roles.EDITOR_ROLE,
    uneditableColumns: [],
  },
  {
    action: 'update',
    role: Roles.EDITOR_ROLE,
    uneditableColumns: [],
    condition: (book, ctx) => ctx?.user.id === book.buyer.id,
  },
  {
    action: 'delete',
    role: Roles.EDITOR_ROLE,
    condition: (book, ctx) => ctx?.user.id === book.buyer.id,
  },
  {
    action: 'custom',
    role: Roles.DEFAULT_ROLE,
    customActionId: ActionIds.LIKE,
  },
]
