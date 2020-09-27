import { createApp } from '@sheeted/server'
import { MongoDriver } from '@sheeted/mongoose'

import { RoleLabels } from './constants'
import { ExampleSheet } from './sheets/example/example.sheet'

export const app = createApp(
  {
    AppTitle: 'Example App',
    Sheets: [ExampleSheet],
    Roles: RoleLabels,
    DatabaseDriver: MongoDriver,
    ApiUsers: [],
  },
  {
    jwt: {
      secret: 'xxxxxxxxx',
      expiresIn: '10d',
    },
    saml: {
      entryPoint: 'http://localhost:8080/simplesaml/saml2/idp/SSOService.php',
      issuer: 'dev',
    },
  },
)
