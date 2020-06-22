/**
 * Raw data shape. Entity type must extends this interface.
 */
export interface EntityBase {
  /**
   * Unique identifer.
   */
  id: string

  /**
   * Timestamp to be created.
   */
  createdAt: number

  /**
   * Timestamp to be last updated.
   */
  updatedAt: number
}

/**
 * Entity id.
 */
export type EntityId = string

/**
 * Entity field
 */
export type Field<Entity> = Exclude<keyof Entity, number | symbol>
