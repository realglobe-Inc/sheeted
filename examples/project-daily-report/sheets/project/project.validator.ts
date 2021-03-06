import { Validator, ValidationResult } from '@sheeted/core'

import { ProjectEntity } from './project.entity'

export const ProjectValidator: Validator<ProjectEntity> = () => (
  input: Partial<ProjectEntity>,
  current: ProjectEntity | null,
): ValidationResult => {
  const result = new ValidationResult<ProjectEntity>()
  if (input && current && input.finishDate! <= current.startDate) {
    result.appendError({
      field: 'finishDate',
      message: 'finishDate must be less than startDate',
    })
  }
  return result
}
