import { Hook } from '@sheeted/core'

import { AccountRepository } from '../account/account.repository'

import { AccountPlanRepository } from './account-plan.repository'
import { AccountPlanEntity } from './account-plan.entity'

export const AccountPlanHook: Hook<AccountPlanEntity> = {
  async onCreate(entity, _ctx, options) {
    const { account } = entity
    const list = await AccountPlanRepository.find(
      {
        filter: account,
        sort: [{ order: 'desc', field: 'startDate' }],
        limit: 1,
        page: 1,
      },
      { transaction: options.transaction },
    )
    const latest = list.entities[0]
    if (latest) {
      await AccountRepository.update(
        account.id,
        { currentPlan: latest.plan },
        {
          transaction: options.transaction,
        },
      )
    }
  },
}
