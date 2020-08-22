import { View } from '@sheeted/core'

import { EntityBEntity } from './entity-b.entity'

export const EntityBView: View<EntityBEntity> = {
  title: 'Entity B',
  display: (entity) => {
    if (entity.cascade) {
      return `${entity.cascade.name} (CASCADE)`
    }
    if (entity.restrict) {
      return `${entity.restrict.name} (RESTRICT)`
    }
    if (entity.setNull) {
      return `${entity.setNull.name} (SET_NULL)`
    }
    return '-'
  },
  columns: [
    {
      field: 'cascade',
      title: 'A (CASCADE)',
    },
    {
      field: 'restrict',
      title: 'A (RESTRICT)',
    },
    {
      field: 'setNull',
      title: 'A (SET_NULL)',
    },
  ],
}
