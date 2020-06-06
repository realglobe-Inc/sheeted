import { Express } from 'express'
import { DefaultIAMRoles, Application, DefaultIAMRole } from '@sheeted/core'
import { MongoDriver } from '@sheeted/mongoose'

import { createApp, ApplicationConfig } from '../../../../src'

export const config: ApplicationConfig = {
  jwt: {
    secret: 'xxxxxxxxxxxxxxx',
    expiresIn: '5m',
  },
  saml: {},
}

export function App(config: ApplicationConfig): Express {
  const application: Application<DefaultIAMRole> = {
    AppTitle: 'App',
    Sheets: [],
    Roles: [
      { label: DefaultIAMRoles.ADMIN_ROLE, value: DefaultIAMRoles.ADMIN_ROLE },
      {
        label: DefaultIAMRoles.DEFAULT_ROLE,
        value: DefaultIAMRoles.DEFAULT_ROLE,
      },
    ],
    DatabaseDriver: MongoDriver,
  }
  const app = createApp(application, config)
  return app
}
