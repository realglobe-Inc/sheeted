import { Express } from 'express'
import { DefaultIAMRoles, Application, DefaultIAMRole } from '@sheeted/core'
import { MongoDriver } from '@sheeted/mongoose'

import { createApp, ApplicationConfig } from '../../../../src'
import { adminUser } from '../../db/users'

export const config: ApplicationConfig = {
  jwt: {
    secret: 'xxxxxxxxxxxxxxx',
    expiresIn: '5m',
  },
  saml: {},
}

export const ADMIN_ACCESS_TOKEN = 'xxxxxxxxxxxxxxxxxxxxxxxxx'

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
    ApiUsers: [
      {
        userId: adminUser.id,
        accessToken: ADMIN_ACCESS_TOKEN,
      },
    ],
  }
  const app = createApp(application, config)
  return app
}
