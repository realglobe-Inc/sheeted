import { buildIAMUserSchema } from '@sheeted/server/build/sheets/IAMUserSheet/IAMUserSchema'
import { Types } from 'mongoose'
import { IAMUserEntity, IAM_USER_SHEET } from '@sheeted/core'
import { compileModel } from '@sheeted/mongoose'

import { Seeder, reduce } from '../util/seeder.util'

import { Roles, PlanName, Color } from './constants'
import { Sheet1Model } from './sheets/sheet1/sheet1.model'
import { Sheet1Entity } from './sheets/sheet1/sheet1.entity'

const userSchema = buildIAMUserSchema<string>([])
// こういうのは repository library 側で提供してほしい
const IAMUserModel = compileModel(IAM_USER_SHEET, userSchema)
const users = Array.from({ length: 60 }).map((_, i) => ({
  _id: Types.ObjectId.createFromTime(100 + i),
  id: 'user' + i,
  name: 'guest' + i,
  email: `guest${i}@example.com`,
  roles: [Roles.DEFAULT_ROLE],
}))
const sheet1Entities = [
  {
    _id: Types.ObjectId.createFromTime(1000),
    id: '1',
    name: 'name',
    integer: 10,
    plan: 'free' as PlanName,
    colors: ['black', 'white'] as Color[],
    user: users[0],
    birthDate: 19801201,
    birthYear: 1980,
    birthTime: 412, // 04:12
  },
]

export const seeders = reduce([
  new Seeder<IAMUserEntity>(IAMUserModel, users),
  new Seeder<Sheet1Entity>(Sheet1Model, sheet1Entities),
])
