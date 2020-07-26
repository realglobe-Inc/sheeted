import { EntityBase } from './EntityBase.type'
import { Type } from './Type.type'

export type SchemaField<E> = {
  /**
   * Field type.
   */
  type: Type<E[keyof E]>

  /**
   * If set true, the field can be omitted.
   */
  optional?: true

  /**
   * If set true, the field cannot be editted manually.
   */
  readonly?: true

  /**
   * If set true, the field is contained in the search target.
   */
  searchable?: true

  /**
   * If set true, the field value cannot be duplicated.
   */
  unique?: true

  /**
   * Properties for Enum type.
   */
  enumProperties?: {
    values: readonly string[]
  }

  /**
   * Properties for Entity type.
   */
  entityProperties?: {
    /**
     * Sheet name of the referenced entity.
     */
    sheetName: string
  }
}

/**
 * Properties of each field in Entity.
 */
export type Schema<Entity = any> = {
  [P in Exclude<keyof Entity, keyof EntityBase>]: SchemaField<Entity>
}
