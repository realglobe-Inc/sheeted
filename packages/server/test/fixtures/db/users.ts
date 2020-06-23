import { IAMUserEntity, DefaultIAMRoles, IAM_USER_SHEET } from '@sheeted/core'
import { compileModel, MongoDriver } from '@sheeted/mongoose'
import { buildIAMUserSchema } from '@sheeted/core/build/sheets/IAMUserSheet/IAMUserSchema'

export const adminUser = {
  id: 'admin',
  name: 'admin',
  email: 'admin@example.com',
  roles: [DefaultIAMRoles.ADMIN_ROLE],
} as IAMUserEntity

export const defaultUser = {
  id: 'user',
  name: 'user',
  email: 'user@example.com',
  roles: [DefaultIAMRoles.DEFAULT_ROLE],
} as IAMUserEntity

const users = [adminUser, defaultUser]
const schema = buildIAMUserSchema<string>([])

export const userModel = compileModel(IAM_USER_SHEET, schema)

export const userRepository = new MongoDriver(IAM_USER_SHEET, schema)

export const seedUsers = async (): Promise<void> => {
  for (const user of users) {
    const found = await userModel.findOne({ id: user.id })
    if (!found) {
      await userModel.create(user)
    }
  }
}
