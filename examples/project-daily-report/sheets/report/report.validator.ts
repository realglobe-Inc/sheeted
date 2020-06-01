import { Validator, ValidationResult } from '@sheeted/core'

import { ReportEntity } from './report.entity'

export const ReportValidator: Validator<ReportEntity> = (_ctx) => (
  input: Partial<ReportEntity>,
  current: ReportEntity | null,
): ValidationResult => {
  const result = new ValidationResult<ReportEntity>()
  const project = input.project || current?.project
  if (
    project &&
    input.date &&
    (input.date < project.startDate || input.date > project.finishDate!)
  ) {
    result.appendError({
      field: 'date',
      message: 'date must be within valid duration',
    })
  }
  return result
}
