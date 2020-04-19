import { EntityBase } from '@sheeted/core'

export interface ProjectEntity extends EntityBase {
  name: string
  startDate: number
  finishDate?: number
}
