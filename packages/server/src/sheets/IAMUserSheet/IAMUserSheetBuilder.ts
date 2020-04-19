import { Sheet, IAMUserEntity, IAM_USER_SHEET } from '@sheeted/core'
import { Model } from 'mongoose'

import { buildIAMUserView } from './IAMUserViewBuilder'
import { buildIAMUserSchema } from './IAMUserSchema'
import { IAMUserValidator } from './IAMUserValidator'
import { IAMUserModel } from './IAMUserModel'

export const buildIAMUserSheet = <Role extends string>(
  roles: readonly { value: Role; label: string }[],
) => {
  const roleValues: Role[] = roles.map((role) => role.value)
  const labels: { [role: string]: string } = Object.fromEntries(
    roles.map(({ value, label }) => [value, label]),
  )
  const IAMUserSheet: Sheet<IAMUserEntity<Role>, Role> = {
    name: IAM_USER_SHEET,
    Schema: buildIAMUserSchema(roleValues),
    Model: IAMUserModel as Model<any>,
    View: buildIAMUserView(labels),
    Validator: IAMUserValidator,
    AccessPolicies: roleValues.map((role) => ({
      action: 'read',
      role,
    })),
  }
  return IAMUserSheet
}
