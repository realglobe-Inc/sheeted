import { HttpError } from '@sheeted/core/build/web/Errors'
import { HttpStatuses } from '@sheeted/core/build/web/Consts'
import { Context } from '@sheeted/core'

export function assertContext(
  context: Context<string> | undefined,
): asserts context is Context<string> {
  if (!context) {
    throw new HttpError('No context', HttpStatuses.BAD_REQUEST)
  }
}
