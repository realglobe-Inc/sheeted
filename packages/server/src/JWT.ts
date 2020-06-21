import jwt from 'jsonwebtoken'
import { IAMUserEntity } from '@sheeted/core'

export class JWT {
  #secret: string
  #expiresIn: string | number

  static COOKIE_KEY = 'jwt'

  constructor(secret: string, expiresIn: string | number) {
    this.#secret = secret
    this.#expiresIn = expiresIn
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

  async verify(token: string): Promise<IAMUserEntity | null> {
    return new Promise((resolve) => {
      jwt.verify(
        token,
        this.#secret,
        {
          algorithms: ['HS256'],
        },
        (err, payload) => {
          if (err) {
            resolve(null)
          } else {
            resolve(payload as IAMUserEntity)
          }
        },
      )
    })
  }
}
