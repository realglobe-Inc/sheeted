import { Sheet, DefaultIAMRole } from '@sheeted/core'

import { SheetNames } from '../../constants'

import { PlanEntity } from './plan.entity'
import { PlanSchema } from './plan.schema'
import { PlanValidator } from './plan.validator'
import { PlanView } from './plan.view'
import { PlanAccessPolicies } from './plan.access-policies'

export const PlanSheet: Sheet<PlanEntity, DefaultIAMRole> = {
  name: SheetNames.PLAN_SHEET,
  Schema: PlanSchema,
  Validator: PlanValidator,
  View: PlanView,
  AccessPolicies: PlanAccessPolicies,
}
