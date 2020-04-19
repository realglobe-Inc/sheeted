import { View } from '@sheeted/core'

import { AggregationEntity } from './aggregation.entity'

export const AggregationView: View<AggregationEntity> = {
  title: 'Monthly Aggregation',
  display: (entity) => String(entity.month),
  columns: {
    project: { title: 'Project' },
    month: { title: 'Month' },
    hours: { title: 'Total Hours' },
  },
}
