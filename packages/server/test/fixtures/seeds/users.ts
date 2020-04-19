import { IAMUserEntity, DefaultIAMRoles } from '@sheeted/core'

import { IAMUserModel } from '../../../src/sheets/IAMUserSheet//IAMUserModel'

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

export const seedUsers = async () => {
  for (const user of users) {
    const found = await IAMUserModel.findOne({ id: user.id })
    if (!found) {
      await IAMUserModel.create(user)
    }
  }
}
