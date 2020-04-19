import { IAMUserEntity } from './entities/IAMUserEntity.type'

/**
 * Context of a request.
 */
export type Context<Role extends string> = {
  /**
   * User who sends a request.
   */
  user: IAMUserEntity<Role>
}
