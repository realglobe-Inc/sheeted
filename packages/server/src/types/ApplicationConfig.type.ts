import { SamlConfig } from 'passport-saml'
import morgan from 'morgan'

/**
 * Sheeted application server config.
 */
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
   * Logger config
   */
  logger?: {
    format: string
    options?: morgan.Options
  }

  /**
   * Content server config
   */
  contentServer?: {
    externalUrl?: string
  }
}
