import { Types, Schema } from '@sheeted/core'

import { SheetNames } from '../../constants'

import { AccountEntity } from './account.entity'

export const AccountSchema: Schema<AccountEntity> = {
  name: {
    type: Types.Text,
    searchable: true,
  },
  email: {
    type: Types.Text,
    searchable: true,
  },
  currentPlan: {
    type: Types.Entity,
    readonly: true,
    entityProperties: {
      sheetName: SheetNames.PLAN_SHEET,
    },
  },
}
