import { Context } from './Context.type'

/**
 * Functions which will executed after creating / updating / destroying entities.
 */
export type Hook<Entity> = {
  onCreate?: (entity: Entity, context: Context<any>) => Promise<void> | void
  onUpdate?: (entity: Entity, context: Context<any>) => Promise<void> | void
  onDestroy?: (entity: Entity, context: Context<any>) => Promise<void> | void
}
