import { View } from '@sheeted/core'

import { EntityCEntity } from './entity-c.entity'

export const EntityCView: View<EntityCEntity> = {
  title: 'Entity C',
  display: (entity) => entity.a.name,
  columns: [
    {
      field: 'a',
      title: 'A (CASCADE)',
    },
  ],
}
