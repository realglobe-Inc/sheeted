import { SchemaField, EntityBase, Types } from '@sheeted/core'

const createdAt: SchemaField<EntityBase> = {
  type: Types.Numeric,
  readonly: true,
}

const updatedAt: SchemaField<EntityBase> = {
  type: Types.Numeric,
  readonly: true,
}

export const EntityBaseSchema = {
  createdAt,
  updatedAt,
}
