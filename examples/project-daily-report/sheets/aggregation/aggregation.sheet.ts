import { Sheet } from '@sheeted/core'

import { SheetNames, Role } from '../../constants'

import { AggregationEntity } from './aggregation.entity'
import { AggregationSchema } from './aggregation.schema'
import { AggregationValidator } from './aggregation.validator'
import { AggregationView } from './aggregation.view'
import { AggregationAccessPolicies } from './aggregation.access-policies'
import { AggregationHook } from './aggregation.hook'

export const AggregationSheet: Sheet<AggregationEntity, Role> = {
  name: SheetNames.AGGREGATION_SHEET,
  Schema: AggregationSchema,
  Validator: AggregationValidator,
  View: AggregationView,
  AccessPolicies: AggregationAccessPolicies,
  Hook: AggregationHook,
}
