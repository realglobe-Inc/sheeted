import { DefaultIAMRoles, Application, DefaultIAMRole } from '@sheeted/core'
import { MongoRepository } from '@sheeted/mongoose'

import { createApp, ApplicationConfig } from '../../../../src'

export const config: ApplicationConfig = {
  jwt: {
    secret: 'xxxxxxxxxxxxxxx',
    expiresIn: '5m',
  },
  saml: {},
}

export function App(config: ApplicationConfig) {
  const application: Application<DefaultIAMRole> = {
    Sheets: [],
    Roles: [
      { label: DefaultIAMRoles.ADMIN_ROLE, value: DefaultIAMRoles.ADMIN_ROLE },
      {
        label: DefaultIAMRoles.DEFAULT_ROLE,
        value: DefaultIAMRoles.DEFAULT_ROLE,
      },
    ],
    Repository: MongoRepository,
  }
  const app = createApp(application, config)
  return app
}
