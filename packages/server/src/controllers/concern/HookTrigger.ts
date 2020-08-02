import { Hook, Context, TransactionOption } from '@sheeted/core'

export class HookTrigger {
  constructor(
    private context: Context<any>,
    private hook: Hook<any> | undefined,
  ) {}

  triggerCreate(entity: unknown, options: TransactionOption): Promise<void> {
    const { context, hook } = this
    return Promise.resolve(hook?.onCreate?.(entity, context, options))
  }

  triggerUpdate(entity: unknown, options: TransactionOption): Promise<void> {
    const { context, hook } = this
    return Promise.resolve(hook?.onUpdate?.(entity, context, options))
  }

  triggerDestroy(entity: unknown, options: TransactionOption): Promise<void> {
    const { context, hook } = this
    return Promise.resolve(hook?.onDestroy?.(entity, context, options))
  }
}
