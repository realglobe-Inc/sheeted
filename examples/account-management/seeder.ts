import { IAMUserRepository, createEntityId } from '@sheeted/mongoose'
import { IAMUserEntity } from '@sheeted/core'

import { Seeder, reduce, defaultUsers } from '../util/seeder.util'

import { AccountRepository } from './sheets/account/account.repository'
import { AccountPlanRepository } from './sheets/account-plan/account-plan.repository'
import { PlanRepository } from './sheets/plan/plan.repository'
import { AccountEntity } from './sheets/account/account.entity'
import { AccountPlanEntity } from './sheets/account-plan/account-plan.entity'
import { PlanEntity } from './sheets/plan/plan.entity'

export const seeders = reduce([
  new Seeder<IAMUserEntity>(IAMUserRepository, defaultUsers),
  new Seeder<AccountEntity>(AccountRepository, [
    {
      id: createEntityId(1),
      name: 'John Doe',
      email: 'johndoe@example.com',
      currentPlan: undefined,
    },
  ]),
  new Seeder<AccountPlanEntity>(AccountPlanRepository, []),
  new Seeder<PlanEntity>(PlanRepository, [
    {
      id: createEntityId(1),
      name: 'free',
      price: 0,
    },
    {
      id: createEntityId(2),
      name: 'basic',
      price: 1000,
    },
    {
      id: createEntityId(3),
      name: 'premium',
      price: 5000,
    },
    {
      id: createEntityId(4),
      name: 'canceled',
      price: 0,
    },
  ]),
])
