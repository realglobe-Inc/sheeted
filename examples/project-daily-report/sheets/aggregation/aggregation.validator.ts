import { Validator, ValidationResult } from '@sheeted/core'

import { AggregationEntity } from './aggregation.entity'

export const AggregationValidator: Validator<AggregationEntity> = () => (): ValidationResult => {
  const result = new ValidationResult<AggregationEntity>()
  // no validations
  return result
}
