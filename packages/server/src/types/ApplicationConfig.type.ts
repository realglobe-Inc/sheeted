import { SamlConfig } from 'passport-saml'
import morgan from 'morgan'

export type ApplicationConfig = {
  /**
   * SAML config
   */
  saml: SamlConfig

  /**
   * JWT config
   */
  jwt: {
    secret: string
    expiresIn: string | number
  }

  /**
   * Logger config (optional)
   */
  logger?: {
    format: string
    options?: morgan.Options
  }

  /**
   * Content server config (optional)
   */
  contentServer?: {
    externalUrl?: string
  }
}
