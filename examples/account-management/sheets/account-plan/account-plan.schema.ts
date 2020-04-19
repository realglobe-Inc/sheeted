import { Types, Schema } from '@sheeted/core'

import { SheetNames } from '../../constants'

import { AccountPlanEntity } from './account-plan.entity'

export const AccountPlanSchema: Schema<AccountPlanEntity> = {
  account: {
    type: Types.Entity,
    entityProperties: {
      sheetName: SheetNames.ACCOUNT_SHEET,
    },
  },
  plan: {
    type: Types.Entity,
    entityProperties: {
      sheetName: SheetNames.PLAN_SHEET,
    },
  },
  startDate: {
    type: Types.CalendarDate,
  },
}
