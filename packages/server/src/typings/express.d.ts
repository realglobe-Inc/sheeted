import { Context } from '@sheeted/core'

declare module 'express' {
  interface Request {
    context?: Context<string>
  }
}
