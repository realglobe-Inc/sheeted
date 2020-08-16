import { EntityBase, Schema, Types } from '@sheeted/core'

import { compileModel } from '../../src'

// --- 01

export interface Entity01 extends EntityBase {
  name: string
}
export const schema01: Schema<Entity01> = {
  name: {
    type: Types.Text,
  },
}
export const model01 = compileModel('model01', schema01)

// --- 02

export interface Entity02 extends EntityBase {
  name: string
  age?: number
  sub?: Entity01
  tags: string[]
}
export const schema02: Schema<Entity02> = {
  name: {
    type: Types.Text,
  },
  age: {
    type: Types.Numeric,
  },
  sub: {
    type: Types.Entity,
    entityProperties: {
      sheetName: model01.modelName,
    },
  },
  tags: {
    type: Types.EnumList,
    enumProperties: {
      values: ['tag1', 'tag2', 'aaa'],
    },
  },
}
export const model02 = compileModel('model02', schema02)
