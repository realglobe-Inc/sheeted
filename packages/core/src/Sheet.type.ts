import { Schema } from './Schema.type'
import { View } from './View.type'
import { AccessPolicy } from './AccessPolicy.type'
import { Hook } from './Hook.type'
import { Validator } from './Validator.type'

/**
 * Sheet definition.
 */
export type Sheet<Entity = any, Role extends string = string> = {
  /**
   * Sheet name. This is used to identify the sheet and create API Endpoint path.
   */
  name: string

  /**
   * Sheet group key to which the sheet belongs.
   */
  group?: string

  /**
   * Data schema.
   */
  Schema: Schema<Entity>

  /**
   * Validator function.
   */
  Validator: Validator<Entity>

  /**
   * Sheet view settings.
   */
  View: View<Entity>

  /**
   * Access policies.
   */
  AccessPolicies: AccessPolicy<Entity, Role>[]

  /**
   * Hook is executed on mutating entity.
   */
  Hook?: Hook<Entity>
}
