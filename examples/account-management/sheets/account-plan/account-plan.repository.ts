import { MongoDriver } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { AccountPlanSchema } from './account-plan.schema'

export const AccountPlanRepository = new MongoDriver(
  SheetNames.ACCOUNT_PLAN_SHEET,
  AccountPlanSchema,
)
