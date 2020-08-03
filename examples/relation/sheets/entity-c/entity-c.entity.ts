import { EntityBase } from '@sheeted/core'

import { EntityAEntity } from '../entity-a/entity-a.entity'

export interface EntityCEntity extends EntityBase {
  a: EntityAEntity
}
