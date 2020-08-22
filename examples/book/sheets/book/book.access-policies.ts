import { AccessPolicy, Context } from '@sheeted/core'

import { Roles, Role, ActionIds } from '../../constants'

import { BookEntity } from './book.entity'

export const BookAccessPolicies: AccessPolicy<BookEntity, Role>[] = [
  {
    action: 'read',
    role: Roles.DEFAULT_ROLE,
  },
  {
    action: 'create',
    role: Roles.DEFAULT_ROLE,
  },
  {
    action: 'update',
    role: Roles.EDITOR_ROLE,
    column: {
      effect: 'deny',
      columns: ['genre'],
    },
    condition: (book: BookEntity, ctx?: Context<Role>): boolean =>
      ctx?.user.id === book.buyer.id,
  },
  {
    action: 'delete',
    role: Roles.EDITOR_ROLE,
    condition: (book: BookEntity, ctx?: Context<Role>): boolean =>
      ctx?.user.id === book.buyer.id,
  },
  {
    action: 'custom',
    role: Roles.DEFAULT_ROLE,
    customActionId: ActionIds.LIKE,
  },
]
