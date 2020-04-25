import { compileModel } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { AccountEntity } from './account.entity'
import { AccountSchema } from './account.schema'

export const AccountModel = compileModel<AccountEntity>(
  SheetNames.ACCOUNT_SHEET,
  AccountSchema,
)
