import { IAMUserEntity, Types, Schema } from '@sheeted/core'

export const buildIAMUserSchema = <Role extends string>(roles: Role[]) => {
  const IAMUserSchema: Schema<IAMUserEntity<Role>> = {
    name: {
      type: Types.Text,
      searchable: true,
    },
    email: {
      type: Types.Text,
      searchable: true,
      unique: true,
    },
    roles: {
      type: Types.EnumList,
      enumProperties: {
        values: roles,
      },
    },
  }
  return IAMUserSchema
}
