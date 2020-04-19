import { EntityBase } from '../EntityBase.type'

export interface IAMUserEntity<Role extends string = string>
  extends EntityBase {
  name: string
  email: string
  roles: Role[]
}
