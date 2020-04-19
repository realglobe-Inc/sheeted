import { Types, Schema } from '@sheeted/core'

import { SheetNames } from '../../constants'

import { AggregationEntity } from './aggregation.entity'

export const AggregationSchema: Schema<AggregationEntity> = {
  project: {
    type: Types.Entity,
    entityProperties: {
      sheetName: SheetNames.PROJECT_SHEET,
    },
  },
  month: {
    type: Types.CalendarMonth,
  },
  hours: {
    type: Types.Numeric,
  },
}
