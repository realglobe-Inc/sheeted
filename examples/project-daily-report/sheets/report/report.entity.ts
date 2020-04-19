import { IAMUserEntity, EntityBase } from '@sheeted/core'

import { ProjectEntity } from '../project/project.entity'

export interface ReportEntity extends EntityBase {
  user: IAMUserEntity
  project: ProjectEntity
  date: number
  time: number
  detail: string
}
