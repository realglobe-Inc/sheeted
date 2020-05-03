import { Hook, Context } from '@sheeted/core'

export class HookTrigger {
  constructor(
    private context: Context<any>,
    private hook: Hook<any> | undefined,
  ) {}

  triggerCreate(entity: any): Promise<void> {
    const { context, hook } = this
    return Promise.resolve(hook?.onCreate?.(entity, context)).catch(
      console.error,
    )
  }

  triggerUpdate(entity: any): Promise<void> {
    const { context, hook } = this
    return Promise.resolve(hook?.onUpdate?.(entity, context)).catch(
      console.error,
    )
  }

  triggerDestroy(entity: any): Promise<void> {
    const { context, hook } = this
    return Promise.resolve(hook?.onDestroy?.(entity, context)).catch(
      console.error,
    )
  }
}
