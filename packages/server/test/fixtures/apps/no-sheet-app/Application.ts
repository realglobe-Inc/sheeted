import { DefaultIAMRoles } from '@sheeted/core'

import { createApp, ApplicationConfig } from '../../../../src'

export const config: ApplicationConfig = {
  jwt: {
    secret: 'xxxxxxxxxxxxxxx',
    expiresIn: '5m',
  },
  saml: {},
}

export function Application(config: ApplicationConfig) {
  const application = {
    Sheets: [],
    Roles: [
      { label: DefaultIAMRoles.ADMIN_ROLE, value: DefaultIAMRoles.ADMIN_ROLE },
      {
        label: DefaultIAMRoles.DEFAULT_ROLE,
        value: DefaultIAMRoles.DEFAULT_ROLE,
      },
    ],
  }
  const app = createApp(application, config)
  return app
}
