import { EntityBase } from '@sheeted/core'

import { PlanEntity } from '../plan/plan.entity'

export interface AccountEntity extends EntityBase {
  name: string
  email: string
  currentPlan?: PlanEntity
}
