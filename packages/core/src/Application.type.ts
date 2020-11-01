import { Sheet } from './Sheet.type'
import { SheetGroup } from './SheetGroup.type'
import { RepositoryDriver } from './Repository.type'
import { Options } from './Options.type'

/**
 * Role label and value
 */
export type RoleObject<Role extends string = string> = {
  label: string
  value: Role
}

/**
 * Server-defined API access token bound to a user
 */
export type ApiUser = {
  userId: string
  accessToken: string
}

/**
 * Application object, which passes to server
 */
export type Application<Role extends string> = {
  AppTitle: string
  Sheets: readonly Sheet<any, Role>[]
  Roles: readonly RoleObject[]
  DatabaseDriver: RepositoryDriver
  Groups?: readonly SheetGroup[]
  ApiUsers?: ApiUser[]
  options?: Options
}
