import { Types, IAM_USER_SHEET, Schema } from '@sheeted/core'

import { PlanNames, Colors } from '../../constants'

import { Sheet1Entity } from './sheet1.entity'

export const Sheet1Schema: Schema<Sheet1Entity> = {
  name: {
    type: Types.Text,
    searchable: true,
  },
  integer: {
    type: Types.Numeric,
    optional: true,
  },
  url: {
    type: Types.Text,
    optional: true,
  },
  plan: {
    type: Types.Enum,
    enumProperties: {
      values: PlanNames,
    },
    optional: true,
  },
  colors: {
    type: Types.EnumList,
    enumProperties: {
      values: Colors,
    },
    optional: true,
  },
  user: {
    type: Types.Entity,
    entityProperties: {
      sheetName: IAM_USER_SHEET,
    },
    optional: true,
  },
  birthDate: {
    type: Types.CalendarDate,
    optional: true,
  },
  birthYear: {
    type: Types.Numeric,
    readonly: true,
  },
  birthTime: {
    type: Types.Time,
    optional: true,
  },
  marriedMonth: {
    type: Types.CalendarMonth,
    optional: true,
  },
  deadYear: {
    type: Types.CalendarYear,
    optional: true,
  },
  comment: {
    type: Types.LongText,
    optional: true,
  },
}
