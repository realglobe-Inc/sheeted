import { Sheet } from './Sheet.type'
import { SheetGroup } from './SheetGroup.type'
import { RepositoryConstructor } from './Repository.type'

export type Application<Role extends string> = {
  Sheets: readonly Sheet<any, Role>[]
  Roles: readonly { label: string; value: Role }[]
  Groups?: readonly SheetGroup[]
  Repository: RepositoryConstructor
}

export type ApplicationEndpoint = <Role extends string>() => Promise<
  Application<Role>
>
