import { compileModel } from '@sheeted/core'

import { SheetNames } from '../../constants'

import { AccountPlanEntity } from './account-plan.entity'
import { AccountPlanSchema } from './account-plan.schema'

export const AccountPlanModel = compileModel<AccountPlanEntity>(
  SheetNames.ACCOUNT_PLAN_SHEET,
  AccountPlanSchema,
)
