import { EntityBase } from '@sheeted/core'

import { AccountEntity } from '../account/account.entity'
import { PlanEntity } from '../plan/plan.entity'

export interface AccountPlanEntity extends EntityBase {
  account: AccountEntity
  plan: PlanEntity
  startDate: number
}
