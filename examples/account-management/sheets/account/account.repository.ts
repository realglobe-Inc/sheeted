import { MongoDriver } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { AccountSchema } from './account.schema'

export const AccountRepository = new MongoDriver(
  SheetNames.ACCOUNT_SHEET,
  AccountSchema,
)
