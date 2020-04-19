import { Sheet, DefaultIAMRole } from '@sheeted/core'

import { SheetNames } from '../../constants'

import { AccountPlanEntity } from './account-plan.entity'
import { AccountPlanValidator } from './account-plan.validator'
import { AccountPlanView } from './account-plan.view'
import { AccountPlanAccessPolicies } from './account-plan.access-policies'
import { AccountPlanHook } from './account-plan.hook'
import { AccountPlanSchema } from './account-plan.schema'
import { AccountPlanModel } from './account-plan.model'

export const AccountPlanSheet: Sheet<AccountPlanEntity, DefaultIAMRole> = {
  name: SheetNames.ACCOUNT_PLAN_SHEET,
  Schema: AccountPlanSchema,
  Model: AccountPlanModel,
  Validator: AccountPlanValidator,
  View: AccountPlanView,
  AccessPolicies: AccountPlanAccessPolicies,
  Hook: AccountPlanHook,
}
