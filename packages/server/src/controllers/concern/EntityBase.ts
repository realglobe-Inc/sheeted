import { SchemaField, EntityBase, Types, ColumnView } from '@sheeted/core'

const createdAt: SchemaField<EntityBase> = {
  type: Types.ISODate,
  readonly: true,
}

const updatedAt: SchemaField<EntityBase> = {
  type: Types.ISODate,
  readonly: true,
}

export const EntityBaseSchema = {
  createdAt,
  updatedAt,
}

export const EntityBaseColumns: { [field: string]: ColumnView } = {
  createdAt: {
    title: '作成日時',
  },
  updatedAt: {
    title: '更新日時',
  },
}
