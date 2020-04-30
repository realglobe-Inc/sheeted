import { Sheet } from '@sheeted/core'

import { SheetNames, Role } from '../../constants'

import { ReportEntity } from './report.entity'
import { ReportSchema } from './report.schema'
import { ReportValidator } from './report.validator'
import { ReportView } from './report.view'
import { ReportAccessPolicies } from './report.access-policies'
import { ReportHook } from './report.hook'

export const ReportSheet: Sheet<ReportEntity, Role> = {
  name: SheetNames.REPORT_SHEET,
  Schema: ReportSchema,
  Validator: ReportValidator,
  View: ReportView,
  AccessPolicies: ReportAccessPolicies,
  Hook: ReportHook,
}
