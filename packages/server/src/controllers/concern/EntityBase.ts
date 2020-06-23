import { SchemaField, EntityBase, Types, ColumnView } from '@sheeted/core'

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

export const EntityBaseColumns: { [field: string]: ColumnView } = {
  createdAt: {
    title: '作成日時',
    detailPageOnly: true,
    numericOptions: {
      formatAsDate: 'YYYY/MM/DD HH:mm:ss',
    },
  },
  updatedAt: {
    title: '更新日時',
    detailPageOnly: true,
    numericOptions: {
      formatAsDate: 'YYYY/MM/DD HH:mm:ss',
    },
  },
}
