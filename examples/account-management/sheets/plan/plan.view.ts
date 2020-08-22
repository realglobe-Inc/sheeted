import { View } from '@sheeted/core'

import { PlanEntity } from './plan.entity'

export const PlanView: View<PlanEntity> = {
  title: 'Plans',
  icon: 'attach_money',
  display: (entity) => entity.name,
  columns: [
    {
      field: 'name',
      title: 'Plan name',
      enumLabels: {
        free: 'FREE',
        basic: 'BASIC',
        premium: 'PREMIUM',
        canceled: 'CANCELED',
      },
    },
    {
      field: 'price',
      title: 'Monthly price',
    },
  ],
}
