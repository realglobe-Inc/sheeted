import { View } from '@sheeted/core'

import { AggregationEntity } from './aggregation.entity'

export const AggregationView: View<AggregationEntity> = {
  title: 'Monthly Aggregation',
  display: (entity) => String(entity.month),
  columns: [
    {
      field: 'project',
      title: 'Project',
    },
    {
      field: 'month',
      title: 'Month',
    },
    {
      field: 'hours',
      title: 'Total Hours',
    },
  ],
}
