import { Types, Schema } from '@sheeted/core'

import { SheetNames } from '../../constants'

import { EntityDEntity } from './entity-d.entity'

export const EntityDSchema: Schema<EntityDEntity> = {
  cascade: {
    type: Types.Entity,
    optional: true,
    entityProperties: {
      sheetName: SheetNames.EntityC,
      onDelete: 'CASCADE',
    },
  },
  restrict: {
    type: Types.Entity,
    optional: true,
    entityProperties: {
      sheetName: SheetNames.EntityC,
      onDelete: 'RESTRICT',
    },
  },
  setNull: {
    type: Types.Entity,
    optional: true,
    entityProperties: {
      sheetName: SheetNames.EntityC,
      onDelete: 'SET_NULL',
    },
  },
}
