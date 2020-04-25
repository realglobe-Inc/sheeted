import { compileModel } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { ReportEntity } from './report.entity'
import { ReportSchema } from './report.schema'

export const ReportModel = compileModel<ReportEntity>(
  SheetNames.REPORT_SHEET,
  ReportSchema,
)
