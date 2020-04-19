import { compileModel } from '@sheeted/core'

import { SheetNames } from '../../constants'

import { AggregationEntity } from './aggregation.entity'
import { AggregationSchema } from './aggregation.schema'

export const AggregationModel = compileModel<AggregationEntity>(
  SheetNames.AGGREGATION_SHEET,
  AggregationSchema,
)
