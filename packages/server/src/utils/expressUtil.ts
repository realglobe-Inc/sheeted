import { Server } from 'http'

import { Express } from 'express'

export const onListen = (app: Express, callback: () => void): void => {
  const listen = app.listen.bind(app)
  const override: Express['listen'] = (...args: any): Server => {
    callback()
    return listen(...args)
  }
  app.listen = override
}
