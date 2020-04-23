import { Context } from './Context.type'
import { Repositories } from './Repository.type'

/**
 * Functions which will executed after creating / updating / destroying entities.
 */
export type Hook<Entity> = {
  onCreate?: (
    entity: Entity,
    context: Context<any>,
    repositories: Repositories,
  ) => Promise<void> | void
  onUpdate?: (
    entity: Entity,
    context: Context<any>,
    repositories: Repositories,
  ) => Promise<void> | void
  onDestroy?: (
    entity: Entity,
    context: Context<any>,
    repositories: Repositories,
  ) => Promise<void> | void
}
