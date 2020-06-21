import { Context } from './Context.type'

/**
 * Policy about columns for reading, creating, and updating
 */
export type ColumnPolicyOption<Key = string> = {
  /**
   * If 'allow' is set, the operation will be allowed for columns specified in `columns`.
   * If 'deny' is set, the operation will be allowed for columns *not* specified in `columns`.
   */
  effect: 'allow' | 'deny'

  /**
   * Column names
   */
  columns: Key[]
}

export type ReadAccessPolicy<Entity = any, Role extends string = string> = {
  action: 'read'
  role: Role
  queryFilter?: Partial<Entity>
  column?: ColumnPolicyOption<keyof Entity>
}

export type CreateAccessPolicy<Entity = any, Role extends string = string> = {
  action: 'create'
  role: Role
  column?: ColumnPolicyOption<keyof Entity>
}

export type UpdateAccessPolicy<Entity = any, Role extends string = string> = {
  action: 'update'
  role: Role
  column?: ColumnPolicyOption<keyof Entity>
  condition?: (entity: Entity, context?: Context<Role>) => boolean
}

export type DeleteAccessPolicy<Entity = any, Role extends string = string> = {
  action: 'delete'
  role: Role
  condition?: (entity: Entity, context?: Context<Role>) => boolean
}

export type ActionAccessPolicy<Entity = any, Role extends string = string> = {
  action: 'custom'
  customActionId: string
  role: Role
  condition?: (entity: Entity, context?: Context<Role>) => boolean
}

export type AccessPolicy<Entity = any, Role extends string = string> =
  | ReadAccessPolicy<Entity, Role>
  | CreateAccessPolicy<Entity, Role>
  | UpdateAccessPolicy<Entity, Role>
  | DeleteAccessPolicy<Entity, Role>
  | ActionAccessPolicy<Entity, Role>
