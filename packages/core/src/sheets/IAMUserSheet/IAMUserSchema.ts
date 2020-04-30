import { IAMUserEntity } from '../../entities/IAMUserEntity.type'
import { Schema } from '../../Schema.type'
import { Types } from '../../Types'

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
