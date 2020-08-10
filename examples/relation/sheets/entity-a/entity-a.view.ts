import { View } from '@sheeted/core'

import { EntityAEntity } from './entity-a.entity'

export const EntityAView: View<EntityAEntity> = {
  title: 'Entity A',
  display: (entity) => entity.name,
  enableDetail: true,
  columns: {
    name: {
      title: 'NAME',
    },
  },
}
