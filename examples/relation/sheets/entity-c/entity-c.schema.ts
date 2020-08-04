import { Types, Schema } from '@sheeted/core'

import { SheetNames } from '../../constants'

import { EntityCEntity } from './entity-c.entity'

export const EntityCSchema: Schema<EntityCEntity> = {
  a: {
    type: Types.Entity,
    entityProperties: {
      sheetName: SheetNames.EntityA,
      onDelete: 'CASCADE',
    },
  },
}
