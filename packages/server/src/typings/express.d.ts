import { Context } from '@sheeted/core'
import { ListQuery } from '@sheeted/core/build/web/Shared.type'

declare module 'express' {
  interface Request {
    context?: Context<string>
    listQuery?: ListQuery
  }
}
