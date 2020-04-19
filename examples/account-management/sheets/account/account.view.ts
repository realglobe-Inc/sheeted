import { View } from '@sheeted/core'

import { AccountEntity } from './account.entity'

export const AccountView: View<AccountEntity> = {
  title: 'Accounts',
  icon: 'account_box',
  display: (entity) => entity.name,
  columns: {
    name: {
      title: 'User name',
    },
    email: {
      title: 'Email',
    },
    currentPlan: {
      title: 'Current plan',
    },
  },
}
