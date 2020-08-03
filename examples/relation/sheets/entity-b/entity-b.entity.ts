import { EntityBase } from '@sheeted/core'

import { EntityAEntity } from '../entity-a/entity-a.entity'

export interface EntityBEntity extends EntityBase {
  cascade?: EntityAEntity
  restrict?: EntityAEntity
  setNull?: EntityAEntity
}
