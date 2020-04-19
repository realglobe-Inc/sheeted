import { WithEntityMetaField } from '@sheeted/core/build/web/Shared.type'
import { EntityBase } from '@sheeted/core'

export type Entity = WithEntityMetaField &
  EntityBase & {
    [field: string]: any
  }
