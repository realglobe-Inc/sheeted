import { Hook } from '@sheeted/core'

import { AccountModel } from '../account/account.model'

import { AccountPlanModel } from './account-plan.model'
import { AccountPlanEntity } from './account-plan.entity'

export const AccountPlanHook: Hook<AccountPlanEntity> = {
  async onCreate(entity, _ctx, options) {
    const { account } = entity
    const latest = await AccountPlanModel.findOne({ account })
      .session(options.transaction)
      .sort('-startDate')
    if (latest) {
      await AccountModel.updateOne(
        { id: account.id },
        { currentPlan: latest.plan },
        {
          session: options.transaction,
        },
      )
    }
  },
}
