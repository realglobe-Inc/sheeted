import { MongoDriver } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { ReportSchema } from './report.schema'

export const ReportRepository = new MongoDriver(
  SheetNames.REPORT_SHEET,
  ReportSchema,
)
