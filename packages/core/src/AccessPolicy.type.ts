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

/**
 * Access policy for reading.
 */
export type ReadAccessPolicy<Entity = any, Role extends string = string> = {
  action: 'read'

  /**
   * Role to be allowed the operation by the access policy.
   */
  role: Role

  /**
   * Query filter
   */
  queryFilter?: Partial<Entity>

  /**
   * Column setting
   */
  column?: ColumnPolicyOption<keyof Entity>
}

export type CreateAccessPolicy<Entity = any, Role extends string = string> = {
  action: 'create'

  /**
   * Role to be allowed the operation by the access policy.
   */
  role: Role

  /**
   * Column setting
   */
  column?: ColumnPolicyOption<keyof Entity>
}

export type UpdateAccessPolicy<Entity = any, Role extends string = string> = {
  action: 'update'

  /**
   * Role to be allowed the operation by the access policy.
   */
  role: Role

  /**
   * Column setting
   */
  column?: ColumnPolicyOption<keyof Entity>

  /**
   * Condition to be allowed. The operation is allowed only when it returns true.
   */
  condition?: (entity: Entity, context?: Context<Role>) => boolean
}

export type DeleteAccessPolicy<Entity = any, Role extends string = string> = {
  action: 'delete'

  /**
   * Role to be allowed the operation by the access policy.
   */
  role: Role

  /**
   * Condition to be allowed. The operation is allowed only when it returns true.
   */
  condition?: (entity: Entity, context?: Context<Role>) => boolean
}

export type ActionAccessPolicy<Entity = any, Role extends string = string> = {
  action: 'custom'

  customActionId: string

  /**
   * Role to be allowed the operation by the access policy.
   */
  role: Role

  /**
   * Condition to be allowed. The operation is allowed only when it returns true.
   */
  condition?: (entity: Entity, context?: Context<Role>) => boolean
}

/**
 * Access policy for a sheet. This defines how roles are allowed to operate the sheet.
 */
export type AccessPolicy<Entity = any, Role extends string = string> =
  | ReadAccessPolicy<Entity, Role>
  | CreateAccessPolicy<Entity, Role>
  | UpdateAccessPolicy<Entity, Role>
  | DeleteAccessPolicy<Entity, Role>
  | ActionAccessPolicy<Entity, Role>
