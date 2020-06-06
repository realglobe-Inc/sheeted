import { Application, IAM_USER_SHEET } from '@sheeted/core'
import Express from 'express'
import cors from 'cors'
import Logger from 'morgan'
import { buildIAMUserSheet } from '@sheeted/core/build/sheets/IAMUserSheet/IAMUserSheetBuilder'

import { SamlPassport } from './Passport'
import { SheetRoute } from './routes/SheetRoute'
import { SignRoute } from './routes/SignRoute'
import { EntityRoute } from './routes/EntityRoute'
import { CurrentUserRoute } from './routes/CurrentUserRoute'
import { ContentRoute } from './routes/ContentRoute'
import { ActionRoute } from './routes/ActionRoute'
import { handleNotFound } from './middlewares/NotFoundMiddleware'
import { handleError } from './middlewares/ErrorMiddleware'
import { ApplicationConfig } from './types/ApplicationConfig.type'
import { JWT } from './JWT'
import { validateSheets } from './server/SheetValidator'
import { RouterBuilder } from './types/Router.type'
import { createRepositories } from './server/Repositories'

export type { ApplicationConfig }

/**
 * Create a Sheeted application server.
 * @param application Application settings which includes sheets
 * @param config Configuration of the server
 */
export const createApp = (
  application: Application<any>,
  config: ApplicationConfig,
): Express.Express => {
  validateSheets(application.Sheets)
  const appTitle = application.AppTitle
  const groups = [...(application.Groups || [])]
  const IAMUserSheet = buildIAMUserSheet(application.Roles)
  const sheets = [IAMUserSheet].concat(application.Sheets)
  const repositories = createRepositories(sheets, application.DatabaseDriver)

  const app = Express()
  app.set('trust proxy', true)
  app.use(cors())
  app.use(Logger(config.logger?.format || 'dev', config.logger?.options))

  const jwt = new JWT(config.jwt.secret, config.jwt.expiresIn)
  const passport = SamlPassport(config.saml, repositories.get(IAM_USER_SHEET))
  app.use(passport.initialize())

  const routes = [
    SignRoute,
    SheetRoute,
    EntityRoute,
    CurrentUserRoute,
    ActionRoute,
    !config.contentServer?.externalUrl && ContentRoute,
  ]
    .filter((Route): Route is RouterBuilder => Boolean(Route))
    .map((Route) =>
      Route({
        appTitle,
        sheets,
        groups,
        config,
        passport,
        jwt,
        repositories,
      }),
    )
  for (const route of routes) {
    app.use(route)
  }
  app.use(handleNotFound)
  app.use(handleError)
  return app
}
