import { Validator, ValidationResult } from '@sheeted/core'

import { AccountPlanEntity } from './account-plan.entity'

export const AccountPlanValidator: Validator<AccountPlanEntity> = (_ctx) => (
  _input,
) => {
  const result = new ValidationResult()
  // no validation
  return result
}
