import { EntityBase } from '@sheeted/core'

import { EntityCEntity } from '../entity-c/entity-c.entity'

export interface EntityDEntity extends EntityBase {
  cascade?: EntityCEntity
  restrict?: EntityCEntity
  setNull?: EntityCEntity
}
