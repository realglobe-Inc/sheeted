import { IAMUserEntity } from '@sheeted/core'
import { Request } from 'express'

import { JWT } from '../JWT'

import { Guard } from './Guard.type'

type Cookies = {
  [key: string]: string | undefined
}

export class JWTGuard implements Guard {
  constructor(private readonly jwt: JWT) {}

  getSecretFromReq(req: Request): string | null {
    const token = (req.cookies as Cookies)[JWT.COOKIE_KEY]
    return token || null
  }

  async verify(token: string): Promise<IAMUserEntity | null> {
    return this.jwt.verify(token)
  }
}
