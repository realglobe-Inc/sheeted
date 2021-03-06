import { Sheet } from '@sheeted/core'

import { SheetNames, Role } from '../../constants'

import { AccountEntity } from './account.entity'
import { AccountSchema } from './account.schema'
import { AccountValidator } from './account.validator'
import { AccountView } from './account.view'
import { AccountAccessPolicies } from './account.access-policies'

export const AccountSheet: Sheet<AccountEntity, Role> = {
  name: SheetNames.ACCOUNT_SHEET,
  Schema: AccountSchema,
  Validator: AccountValidator,
  View: AccountView,
  AccessPolicies: AccountAccessPolicies,
}
