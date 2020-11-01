import { Sheet } from '../../Sheet.type'
import { IAMUserEntity } from '../../entities/IAMUserEntity.type'
import { IAM_USER_SHEET } from '../../Const'
import { View } from '../../View.type'

import { buildIAMUserView } from './IAMUserViewBuilder'
import { buildIAMUserSchema } from './IAMUserSchema'
import { IAMUserValidator } from './IAMUserValidator'

export const buildIAMUserSheet = <Role extends string>(
  roles: readonly { value: Role; label: string }[],
  options: { viewOverride?: Partial<View<IAMUserEntity>> } = {},
): Sheet<IAMUserEntity<Role>, Role> => {
  const { viewOverride } = options
  const roleValues: Role[] = roles.map((role) => role.value)
  const labels: { [role: string]: string } = Object.fromEntries(
    roles.map(({ value, label }) => [value, label]),
  )
  const IAMUserSheet: Sheet<IAMUserEntity<Role>, Role> = {
    name: IAM_USER_SHEET,
    Schema: buildIAMUserSchema(roleValues),
    View: { ...buildIAMUserView(labels), ...(viewOverride || {}) },
    Validator: IAMUserValidator,
    AccessPolicies: roleValues.map((role) => ({
      action: 'read',
      role,
    })),
  }
  return IAMUserSheet
}
