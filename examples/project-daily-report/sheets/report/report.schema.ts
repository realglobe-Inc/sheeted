import { IAM_USER_SHEET, Schema, Types } from '@sheeted/core'

import { SheetNames } from '../../constants'

import { ReportEntity } from './report.entity'

export const ReportSchema: Schema<ReportEntity> = {
  user: {
    type: Types.Entity,
    entityProperties: {
      sheetName: IAM_USER_SHEET,
    },
    readonly: true,
  },
  project: {
    type: Types.Entity,
    entityProperties: {
      sheetName: SheetNames.PROJECT_SHEET,
    },
  },
  date: {
    type: Types.CalendarDate,
  },
  time: {
    type: Types.Time,
  },
  detail: {
    type: Types.Text,
  },
}
