export type ReadAccessPolicy<Entity = any, Role extends string = string> = {
  action: 'read'
  role: Role
  queryFilter?: Partial<Entity>
  excludeColumns?: (keyof Entity)[]
}

export type CreateAccessPolicy<Entity = any, Role extends string = string> = {
  action: 'create'
  role: Role
  uneditableColumns?: (keyof Entity)[]
}

export type UpdateAccessPolicy<Entity = any, Role extends string = string> = {
  action: 'update'
  role: Role
  uneditableColumns?: (keyof Entity)[]
  condition?: (entity: Entity) => boolean
}

export type DeleteAccessPolicy<Entity = any, Role extends string = string> = {
  action: 'delete'
  role: Role
  condition?: (entity: Entity) => boolean
}

export type AccessPolicy<Entity = any, Role extends string = string> =
  | ReadAccessPolicy<Entity, Role>
  | CreateAccessPolicy<Entity, Role>
  | UpdateAccessPolicy<Entity, Role>
  | DeleteAccessPolicy<Entity, Role>
