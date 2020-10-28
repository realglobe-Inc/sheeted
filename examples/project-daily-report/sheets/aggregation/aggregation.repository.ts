import { MongoDriver } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { AggregationSchema } from './aggregation.schema'

export const AggregationRepository = new MongoDriver(
  SheetNames.AGGREGATION_SHEET,
  AggregationSchema,
)
