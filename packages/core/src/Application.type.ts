import { Sheet } from './Sheet.type'
import { SheetGroup } from './SheetGroup.type'
import { RepositoryDriver } from './Repository.type'

export type RoleObject<Role extends string = string> = {
  label: string
  value: Role
}

export type Application<Role extends string> = {
  AppTitle: string
  Sheets: readonly Sheet<any, Role>[]
  Roles: readonly RoleObject[]
  Groups?: readonly SheetGroup[]
  DatabaseDriver: RepositoryDriver
}
