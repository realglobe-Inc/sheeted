import { View } from '@sheeted/core'

import { AccountPlanEntity } from './account-plan.entity'

export const AccountPlanView: View<AccountPlanEntity> = {
  title: 'Account Plans',
  icon: 'assignment',
  display: (entity) => `${entity.account.name}(${entity.plan})`,
  columns: {
    plan: {
      title: 'Plan',
    },
    account: {
      title: 'Account',
    },
    startDate: {
      title: 'Start Date',
    },
  },
}
