import { Types, Schema } from '@sheeted/core'

import { EntityAEntity } from './entity-a.entity'

export const EntityASchema: Schema<EntityAEntity> = {
  name: {
    type: Types.Text,
    optional: true,
  },
}
