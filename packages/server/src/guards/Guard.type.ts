import { Request } from 'express'
import { IAMUserEntity } from '@sheeted/core'

export interface Guard {
  getSecretFromReq(req: Request): string | null
  verify(token: string): Promise<IAMUserEntity | null>
}
