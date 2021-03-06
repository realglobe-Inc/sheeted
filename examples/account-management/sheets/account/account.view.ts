import { View } from '@sheeted/core'

import { AccountEntity } from './account.entity'

export const AccountView: View<AccountEntity> = {
  title: 'Accounts',
  icon: 'account_box',
  display: (entity) => entity.name,
  columns: [
    {
      field: 'name',
      title: 'User name',
    },
    {
      field: 'email',
      title: 'Email',
    },
    {
      field: 'currentPlan',
      title: 'Current plan',
    },
  ],
}
