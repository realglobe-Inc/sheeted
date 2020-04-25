import { IAMUserEntity, DefaultIAMRoles, IAM_USER_SHEET } from '@sheeted/core'
import { compileModel, MongoRepository } from '@sheeted/mongoose'

import { buildIAMUserSchema } from '../../../src/sheets/IAMUserSheet/IAMUserSchema'

export const adminUser: IAMUserEntity = {
  id: 'admin',
  name: 'admin',
  email: 'admin@example.com',
  roles: [DefaultIAMRoles.ADMIN_ROLE],
}

export const defaultUser: IAMUserEntity = {
  id: 'user',
  name: 'user',
  email: 'user@example.com',
  roles: [DefaultIAMRoles.DEFAULT_ROLE],
}

const users = [adminUser, defaultUser]
const schema = buildIAMUserSchema<string>([])

export const userModel = compileModel(IAM_USER_SHEET, schema)

export const userRepository = new MongoRepository(IAM_USER_SHEET, schema)

export const seedUsers = async () => {
  for (const user of users) {
    const found = await userModel.findOne({ id: user.id })
    if (!found) {
      await userModel.create(user)
    }
  }
}
