import { Hook, Context } from '@sheeted/core'

export class HookTrigger {
  constructor(private hook: Hook<any> | undefined) {}

  triggerCreate(entity: any, context: Context<any>): Promise<void> {
    return Promise.resolve(this.hook?.onCreate?.(entity, context)).catch(
      console.error,
    )
  }

  triggerUpdate(entity: any, context: Context<any>): Promise<void> {
    return Promise.resolve(this.hook?.onUpdate?.(entity, context)).catch(
      console.error,
    )
  }

  triggerDestroy(entity: any, context: Context<any>): Promise<void> {
    return Promise.resolve(this.hook?.onDestroy?.(entity, context)).catch(
      console.error,
    )
  }
}
