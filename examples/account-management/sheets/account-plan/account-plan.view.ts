import { View } from '@sheeted/core'

import { AccountPlanEntity } from './account-plan.entity'

export const AccountPlanView: View<AccountPlanEntity> = {
  title: 'Account Plans',
  icon: 'assignment',
  display: (entity) => `${entity.account.name}(${entity.plan.name})`,
  columns: [
    {
      field: 'plan',
      title: 'Plan',
    },
    {
      field: 'account',
      title: 'Account',
    },
    {
      field: 'startDate',
      title: 'Start Date',
    },
  ],
}
