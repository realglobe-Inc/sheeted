/**
 * Raw data shape. Entity type must extends this interface.
 */
export interface EntityBase {
  /**
   * Unique identifer.
   */
  id: string
}

/**
 * Entity id.
 */
export type EntityId = string

/**
 * Entity field
 */
export type Field<Entity> = Exclude<keyof Entity, number | symbol>
