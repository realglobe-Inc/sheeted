import { EntityBase } from '@sheeted/core'

import { PlanName } from '../../constants'

export interface PlanEntity extends EntityBase {
  name: PlanName
  price: number
}
