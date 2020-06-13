import { Request } from 'express'
import { IAMUserEntity, ApiUser, Repository } from '@sheeted/core'

import { Guard } from './Guard.type'

export class ApiTokenGuard implements Guard {
  constructor(
    private apiUsers: ApiUser[],
    private iamUserRepository: Repository<IAMUserEntity>,
  ) {}

  getSecretFromReq(req: Request): string | null {
    const { authorization } = req.headers
    const [bearer, token, ...rest] = authorization?.split(' ') ?? ['']
    if (rest.length > 0) {
      // Doesn't allow additional spaces
      return null
    }
    if (bearer.toLowerCase() === 'token' && Boolean(token)) {
      return token
    } else {
      return null
    }
  }

  async verify(token: string): Promise<IAMUserEntity | null> {
    const { userId } = this.apiUsers.find((u) => u.accessToken === token) || {}
    if (!userId) {
      return Promise.resolve(null)
    }
    const user = await this.iamUserRepository.findById(userId)
    return user
  }
}
