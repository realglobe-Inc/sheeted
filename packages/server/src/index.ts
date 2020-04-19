import { Application } from '@sheeted/core'
import Express from 'express'
import cors from 'cors'
import Logger from 'morgan'

import { SamlPassport } from './Passport'
import { buildIAMUserSheet } from './sheets/IAMUserSheet/IAMUserSheetBuilder'
import { buildSheetRoute } from './routes/SheetRoute'
import { buildSignRoutes } from './routes/SignRoute'
import { buildEntityRoute } from './routes/EntityRoute'
import { currentUserRoute } from './routes/CurrentUserRoute'
import { contentRoute } from './routes/ContentRoute'
import { handleNotFound } from './middlewares/NotFoundMiddleware'
import { handleError } from './middlewares/ErrorMiddleware'
import { ApplicationConfig } from './types/ApplicationConfig.type'
import { JWT } from './JWT'
import { validateSheets } from './server/SheetValidator'

export { IAMUserModel } from './sheets/IAMUserSheet/IAMUserModel'
export type { ApplicationConfig }

export const createApp = (
  application: Application<string>,
  config: ApplicationConfig,
) => {
  validateSheets(application.Sheets)
  const IAMUserSheet = buildIAMUserSheet(application.Roles)
  const Sheets = [IAMUserSheet].concat(application.Sheets)

  const app = Express()
  app.set('trust proxy', true)
  app.use(cors())
  app.use(Logger(config.logger?.format || 'dev', config.logger?.options))

  const jwt = new JWT(config.jwt.secret, config.jwt.expiresIn)
  const passport = SamlPassport(config.saml)
  app.use(passport.initialize())

  const routes = [
    buildSignRoutes(passport, jwt, {
      contentUrl: config.contentServer?.externalUrl,
    }),
    buildSheetRoute(Sheets, [...(application.Groups || [])], jwt),
    buildEntityRoute(Sheets, jwt),
    currentUserRoute(jwt),
    !config.contentServer?.externalUrl &&
      contentRoute({
        version: require('../package.json').version,
      }),
  ].filter((route): route is Express.Router => Boolean(route))
  for (const route of routes) {
    app.use(route)
  }
  app.use(handleNotFound)
  app.use(handleError)
  return app
}
