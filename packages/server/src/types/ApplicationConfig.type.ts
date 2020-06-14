import { SamlConfig } from 'passport-saml'

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
   * Content server config
   */
  contentServer?: {
    externalUrl?: string
  }
}
