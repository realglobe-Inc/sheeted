import { InputForm } from '../Type.type'
import { SheetGroup } from '../SheetGroup.type'
import { EntityBase } from '../EntityBase.type'

import { ENTITY_META_FIELD } from './Consts'

export type AppInfo = {
  appTitle: string
}

export type Column = {
  field: string
  title: string
  form?: InputForm
  formOptions?: any
  index: number

  readonly?: boolean
  // based on access policy
  readonlyOnCreate?: boolean
  readonlyOnUpdate?: boolean

  style: { [property: string]: any }
  detailPageOnly?: boolean

  custom: {
    entity?: {
      sheetName: string
    }
    enum?: {
      multiple?: boolean
      labels: {
        label: string
        value: string
      }[]
    }
    text?: {
      isLink?: boolean
    }
    numeric?: {
      formatWithIntl?: {
        locales: string
        options: Intl.NumberFormatOptions
      }
      formatAsDate?: string
    }
  }
}

export type Permissions = {
  creates: boolean
  updates: boolean
  deletes: boolean
}

export type WithEntityMetaField = {
  [ENTITY_META_FIELD]: {
    displayText: string
    permissions: {
      updates: boolean
      deletes: boolean
      customActions: {
        [actionId: string]: boolean
      }
    }
  }
}

export type SheetInfo = {
  sheetName: string
  title: string
  enableDetail: boolean
  columns: Column[]
  permissions: Permissions
  actions: ActionInfo[]
}

export type ListQuery = {
  page: number
  limit: number
  search: string
  sort: {
    field: string
    order: 'asc' | 'desc'
  }[]
  filter: Record<string, any>
}

export type ListResult = {
  entities: any[]
  total: number
  page: number
  pages: number
}

export type DeleteFailureReason =
  | 'PERMISSION_DENIED'
  | 'RESTRICT'
  | 'NOT_FOUND'
  | 'OTHER'

export type DeleteResult = {
  success: (EntityBase & WithEntityMetaField)[]
  failure: {
    entity: EntityBase & WithEntityMetaField
    reason: DeleteFailureReason
    message?: string
  }[]
}

export type Sheets = {
  groups: SheetGroup[]
  sheets: SheetOverview[]
}

export type SheetOverview = {
  sheetName: string
  title: string
  group?: string
  icon?: string
}

export type InputValidationErrors = {
  errors: { message: string; field: string }[]
}

export type ActionInfo = {
  id: string
  title: string
  icon?: string
}
