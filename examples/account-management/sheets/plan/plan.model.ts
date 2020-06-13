import { compileModel } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { PlanEntity } from './plan.entity'
import { PlanSchema } from './plan.schema'

export const PlanModel = compileModel<PlanEntity>(
  SheetNames.PLAN_SHEET,
  PlanSchema,
)