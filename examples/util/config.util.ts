import { ApplicationConfig } from '@sheeted/server'

export const config: ApplicationConfig = {
  contentServer: {
    externalUrl: 'http://localhost:3000',
  },
  jwt: {
    secret: 'xxxxxxxxx',
    expiresIn: '10d',
  },
  saml: {
    entryPoint: process.env.SAML_IDP_ENTRYPOINT,
    issuer: process.env.SAML_ISSUER,
  },
}
