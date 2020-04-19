import { Types, Schema } from '@sheeted/core'

import { PlanNames } from '../../constants'

import { PlanEntity } from './plan.entity'

export const PlanSchema: Schema<PlanEntity> = {
  name: {
    type: Types.Enum,
    readonly: true,
    enumProperties: {
      values: PlanNames,
    },
  },
  price: {
    type: Types.Numeric,
  },
}
