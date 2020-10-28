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
export type SearchQuery<Entity> = {
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
  search?: SearchQuery<Entity>

  /**
   * Filter object. Find entities only matching the object.
   */
  filter?: Partial<Entity>
}

export type TransactionOption = { transaction: any }

/**
 * Repository interface via which application access persistent data.
 */
export type Repository<Entity> = {
  /**
   * Repository name same as sheet name
   */
  name: string

  /**
   * Initialize the repository
   */
  initialize(): Promise<void>

  /**
   * Create transaction block
   */
  transaction<R>(callback: (transaction: any) => Promise<R>): Promise<R>

  /**
   * Find entities by condition
   */
  find(
    condition: FindListQuery<Entity>,
    options?: TransactionOption,
  ): Promise<FindListResult<Entity>>

  /**
   * Find an entity by id
   */
  findById(id: EntityId, options?: TransactionOption): Promise<Entity | null>

  /**
   * Find entities by ids
   */
  findByIds(
    ids: EntityId[],
    options?: TransactionOption,
  ): Promise<{ [id: string]: Entity | null }>

  /**
   * Find an entity
   */
  findOne(
    filter: Partial<Entity>,
    options?: TransactionOption,
  ): Promise<Entity | null>

  /**
   * Create an entity
   */
  create(input: Partial<Entity>, options?: TransactionOption): Promise<Entity>

  /**
   * Create entities
   */
  createBulk(
    inputs: Partial<Entity>[],
    options?: TransactionOption,
  ): Promise<Entity[]>

  /**
   * Update an entity
   */
  update(
    id: EntityId,
    changes: Partial<Entity>,
    options?: TransactionOption,
  ): Promise<Entity>

  /**
   * Update entities
   */
  updateBulk(
    ids: EntityId[],
    changes: Partial<Entity>,
    options?: TransactionOption,
  ): Promise<(Entity | null)[]>

  /**
   * Destroy an entity
   */
  destroy(id: EntityId, options?: TransactionOption): Promise<void>

  /**
   * Destroy entities
   */
  destroyBulk(ids: EntityId[], options?: TransactionOption): Promise<void>
}

/**
 * Repository driver interface
 */
export type RepositoryDriver = {
  new <Entity>(name: string, schema: Schema<Entity>): Repository<Entity>
}

/**
 * Repositories for a sheet.
 */
export type Repositories = {
  get<Entity>(sheetName: string): Repository<Entity>

  initialize(): Promise<void>
}
