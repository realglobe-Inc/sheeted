import jwt from 'jsonwebtoken'
import { IAMUserEntity } from '@sheeted/core'
import { Request, Response, NextFunction } from 'express'

const getToken = (req: Request): string | null => {
  const { authorization } = req.headers
  const [bearer, token] = authorization?.split(' ') ?? []
  if (bearer === 'Bearer') {
    return token
  } else {
    return null
  }
}

export class JWT {
  #secret: string
  #expiresIn: string | number

  guard: (req: Request, res: Response, next: NextFunction) => void

  constructor(secret: string, expiresIn: string | number) {
    this.#secret = secret
    this.#expiresIn = expiresIn
    this.guard = this._guard.bind(this)
  }

  async sign(payload: IAMUserEntity): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        this.#secret,
        { algorithm: 'HS256', expiresIn: this.#expiresIn },
        (err, token) => {
          if (err) {
            reject(err)
          } else {
            resolve(token)
          }
        },
      )
    })
  }

  async verify(token: string): Promise<IAMUserEntity> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        this.#secret,
        {
          algorithms: ['HS256'],
        },
        (err, payload) => {
          if (err) {
            reject(err)
          } else {
            resolve(payload as IAMUserEntity)
          }
        },
      )
    })
  }

  private async _guard(req: Request, res: Response, next: NextFunction) {
    const token = getToken(req)
    if (!token) {
      res.status(401)
      res.json({
        error: 'Unauthorized',
      })
      return
    }
    try {
      const user = await this.verify(token)
      req.context = { user }
      next()
    } catch (e) {
      res.status(401)
      res.json({
        error: 'Unauthorized',
      })
    }
  }
}
