import { Validator, ValidationResult } from '@sheeted/core'

import { AccountEntity } from './account.entity'

export const AccountValidator: Validator<AccountEntity> = (_ctx) => (input) => {
  const result = new ValidationResult<AccountEntity>()
  if (input?.name?.length! <= 1) {
    result.appendError({
      field: 'name',
      message: 'Too short',
    })
  }
  const pattern = /^[a-zA-Z0-9-_.]+@[a-zA-Z0-9-_.]+$/
  if (input?.email && !pattern.test(input.email)) {
    result.appendError({
      field: 'email',
      message: 'Invalid email',
    })
  }
  return result
}
