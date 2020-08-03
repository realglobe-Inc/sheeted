import { View } from '@sheeted/core'

import { EntityDEntity } from './entity-d.entity'

export const EntityDView: View<EntityDEntity> = {
  title: 'Entity D',
  display: (entity) => {
    if (entity.cascade) {
      return `${entity.cascade.a.name} (CASCADE)`
    }
    if (entity.restrict) {
      return `${entity.restrict.a.name} (RESTRICT)`
    }
    if (entity.setNull) {
      return `${entity.setNull.a.name} (SET_NULL)`
    }
    return '-'
  },
  columns: {
    cascade: {
      title: 'A (CASCADE)',
    },
    restrict: {
      title: 'A (RESTRICT)',
    },
    setNull: {
      title: 'A (SET_NULL)',
    },
  },
}
