import { Type } from './Type.type'

export type SchemaField<E> = {
  type: Type<E[keyof E]>
  optional?: true
  readonly?: true
  searchable?: true
  unique?: true
  enumProperties?: {
    values: readonly string[]
  }
  entityProperties?: {
    sheetName: string
  }
}

/**
 * Properties of each field in Entity.
 */
export type Schema<Entity = any> = {
  [P in Exclude<keyof Entity, 'id'>]: SchemaField<Entity>
}
