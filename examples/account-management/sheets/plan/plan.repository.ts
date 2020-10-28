import { MongoDriver } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { PlanSchema } from './plan.schema'

export const PlanRepository = new MongoDriver(SheetNames.PLAN_SHEET, PlanSchema)
