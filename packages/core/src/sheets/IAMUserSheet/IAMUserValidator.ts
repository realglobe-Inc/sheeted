import { Validator } from '../../Validator.type'
import { IAMUserEntity } from '../../entities/IAMUserEntity.type'
import { ValidationResult } from '../../ValidationResult'

export const IAMUserValidator: Validator<IAMUserEntity> = () => (
  input: Partial<IAMUserEntity>,
) => {
  const result = new ValidationResult<IAMUserEntity>()
  if (input.name && input.name.length <= 1) {
    result.appendError({ field: 'name', message: 'Too short name' })
  }
  const pattern = /^[a-zA-Z0-9-_.]+@[a-zA-Z0-9-_.]+$/
  if (input.email && !pattern.test(input.email)) {
    result.appendError({ field: 'email', message: 'Invalid email' })
  }
  if (input.roles?.length === 0) {
    result.appendError({
      field: 'roles',
      message: 'At least one role is needed',
    })
  }
  return result
}
