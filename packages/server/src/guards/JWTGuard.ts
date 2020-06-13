import { IAMUserEntity } from '@sheeted/core'
import { Request } from 'express'

import { JWT } from '../JWT'

import { Guard } from './Guard.type'

export class JWTGuard implements Guard {
  constructor(private readonly jwt: JWT) {}

  getSecretFromReq(req: Request): string | null {
    const { authorization } = req.headers
    const [bearer, token, ...rest] = authorization?.split(' ') ?? ['']
    if (rest.length > 0) {
      // Doesn't allow additional spaces
      return null
    }
    if (bearer.toLowerCase() === 'bearer' && Boolean(token)) {
      return token
    } else {
      return null
    }
  }

  async verify(token: string): Promise<IAMUserEntity | null> {
    return this.jwt.verify(token)
  }
}
