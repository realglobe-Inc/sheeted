import { Context } from './Context.type'
import { TransactionOption } from './Repository.type'

/**
 * Functions which will executed after creating / updating / destroying entities.
 */
export type Hook<Entity> = {
  onCreate?: (
    entity: Entity,
    context: Context<any>,
    options?: TransactionOption,
  ) => Promise<void> | void
  onUpdate?: (
    entity: Entity,
    context: Context<any>,
    options?: TransactionOption,
  ) => Promise<void> | void
  onDestroy?: (
    entity: Entity,
    context: Context<any>,
    options?: TransactionOption,
  ) => Promise<void> | void
}
