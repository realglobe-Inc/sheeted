import { IAMUserEntity, EntityBase } from '@sheeted/core'

import { PlanName, Color } from '../../constants'

export interface Sheet1Entity extends EntityBase {
  name: string
  integer?: number
  url?: string
  plan?: PlanName
  colors?: Color[]
  user?: IAMUserEntity
  birthDate?: number
  birthYear?: number
  birthTime?: number
  marriedMonth?: number
  deadYear?: number
  comment?: string
}
