import { Sheet } from '@sheeted/core'

import { Role, SheetNames } from '../../constants'

import { BookEntity } from './book.entity'
import { BookSchema } from './book.schema'
import { BookValidator } from './book.validator'
import { BookView } from './book.view'
import { BookAccessPolicies } from './book.access-policies'
import { BookActions } from './book.actions'
import { BookHook } from './book.hook'

export const BookSheet: Sheet<BookEntity, Role> = {
  name: SheetNames.BOOK,
  Schema: BookSchema,
  Validator: BookValidator,
  View: BookView,
  AccessPolicies: BookAccessPolicies,
  Actions: BookActions,
  Hook: BookHook,
}
