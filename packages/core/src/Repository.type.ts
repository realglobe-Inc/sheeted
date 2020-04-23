import { Field, EntityId } from './EntityBase.type'
import { Schema } from './Schema.type'

/**
 * Result of find() method.
 */
export type FindListResult<Entity> = {
  page: number
  pages: number
  total: number
  entities: Entity[]
}

/**
 * Sort order.
 */
export type SortOrder = 'asc' | 'desc'

/**
 * Sort query object.
 */
export type SortQuery<Entity> = {
  field: Field<Entity>
  order: SortOrder
}

/**
 * Search query object. Search words (AND condition) over fields (OR condition).
 */
export type SeachQuery<Entity> = {
  fields: Field<Entity>[]
  words: string[]
}

/**
 * Condition object given to find() argument.
 */
export type FindListQuery<Entity = any> = {
  /**
   * Page number (starts with 1).
   */
  page: number

  /**
   * Max count number of returned entities.
   */
  limit: number

  /**
   * Sort list.
   */
  sort: SortQuery<Entity>[]

  /**
   * Search string
   */
  search?: SeachQuery<Entity>

  /**
   * Filter object. Find entities only matching the object.
   */
  filter?: Partial<Entity>
}

/**
 * Repository interface via which application access persistent data.
 */
export type Repository<Entity> = {
  /**
   * Find entities by condition
   */
  find(condition: FindListQuery<Entity>): Promise<FindListResult<Entity>>

  /**
   * Find an entity by id
   */
  findById(id: EntityId): Promise<Entity | null>

  /**
   * Create an entity
   */
  create(input: Partial<Entity>): Promise<Entity>

  /**
   * Create entities
   */
  createBulk(inputs: Partial<Entity>[]): Promise<Entity[]>

  /**
   * Update an entity
   */
  update(id: EntityId, changes: Partial<Entity>): Promise<Entity>

  /**
   * Update entities
   */
  updateBulk(
    ids: EntityId[],
    changes: Partial<Entity>,
  ): Promise<(Entity | null)[]>

  /**
   * Destroy an entity
   */
  destroy(id: EntityId): Promise<void>

  /**
   * Destroy entities
   */
  destroyBulk(ids: EntityId[]): Promise<void>
}

/**
 * Repository constructor interface
 */
export type RepositoryConstructor = {
  new <Entity>(name: string, schema: Schema<Entity>): Repository<Entity>
}
