import { EntityBase } from '@sheeted/core'

import { ProjectEntity } from '../project/project.entity'

export interface AggregationEntity extends EntityBase {
  project: ProjectEntity
  month: number
  hours: number
}
