import { Types } from 'mongoose'
import { IAMUserModel } from '@sheeted/mongoose'
import { IAMUserEntity } from '@sheeted/core'

import { Seeder, reduce, defaultUsers } from '../util/seeder.util'

import { AccountModel } from './sheets/account/account.model'
import { AccountPlanModel } from './sheets/account-plan/account-plan.model'
import { PlanModel } from './sheets/plan/plan.model'
import { AccountEntity } from './sheets/account/account.entity'
import { AccountPlanEntity } from './sheets/account-plan/account-plan.entity'
import { PlanEntity } from './sheets/plan/plan.entity'

export const seeders = reduce([
  new Seeder<IAMUserEntity>(IAMUserModel, defaultUsers),
  new Seeder<AccountEntity>(AccountModel, [
    {
      _id: Types.ObjectId.createFromTime(0),
      id: 'user01',
      name: 'John Doe',
      email: 'johndoe@example.com',
      currentPlan: undefined,
    },
  ]),
  new Seeder<AccountPlanEntity>(AccountPlanModel, []),
  new Seeder<PlanEntity>(PlanModel, [
    {
      _id: Types.ObjectId.createFromTime(0),
      id: 'free',
      name: 'free',
      price: 0,
    },
    {
      _id: Types.ObjectId.createFromTime(1),
      id: 'basic',
      name: 'basic',
      price: 1000,
    },
    {
      _id: Types.ObjectId.createFromTime(2),
      id: 'premium',
      name: 'premium',
      price: 5000,
    },
    {
      _id: Types.ObjectId.createFromTime(3),
      id: 'canceled',
      name: 'canceled',
      price: 0,
    },
  ]),
])
