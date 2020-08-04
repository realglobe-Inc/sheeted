import { Types, Schema } from '@sheeted/core'

import { SheetNames } from '../../constants'

import { AccountEntity } from './account.entity'

export const AccountSchema: Schema<AccountEntity> = {
  name: {
    type: Types.Text,
  },
  email: {
    type: Types.Text,
  },
  currentPlan: {
    type: Types.Entity,
    readonly: true,
    entityProperties: {
      sheetName: SheetNames.PLAN_SHEET,
    },
  },
}
