import { Types, Schema } from '@sheeted/core'

import { SheetNames } from '../../constants'

import { EntityBEntity } from './entity-b.entity'

export const EntityBSchema: Schema<EntityBEntity> = {
  cascade: {
    type: Types.Entity,
    optional: true,
    entityProperties: {
      sheetName: SheetNames.EntityA,
      onDelete: 'CASCADE',
    },
  },
  restrict: {
    type: Types.Entity,
    optional: true,
    entityProperties: {
      sheetName: SheetNames.EntityA,
      onDelete: 'RESTRICT',
    },
  },
  setNull: {
    type: Types.Entity,
    optional: true,
    entityProperties: {
      sheetName: SheetNames.EntityA,
      onDelete: 'SET_NULL',
    },
  },
}
