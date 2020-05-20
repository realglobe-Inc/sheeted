import { Context } from './Context.type'

/**
 * A custom operation to entitites. An user select entities, and perform an action to them.
 */
export type Action<Entity = any> = {
  /**
   * A unique string used for URL path
   */
  id: string

  /**
   * The action title.
   */
  title: string

  /**
   * Icon
   */
  icon?: string

  /**
   * The function which is executed on performing the action.
   */
  perform: (entities: Entity[], context: Context<any>) => Promise<void> | void
}
