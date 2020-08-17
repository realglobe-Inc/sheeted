import { InputForm } from '../Type.type'
import { SheetGroup } from '../SheetGroup.type'

import {
  ENTITY_META_FIELD,
  ValidationErrorTypes,
  DeleteFailureReasons,
  ActionFailureReasons,
} from './Consts'

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

export type OperationResult<Reason> = {
  success: {
    id: string
  }[]
  failure: {
    id: string
    reason: Reason
    message?: string
  }[]
}

export type ActionFailureReason = typeof ActionFailureReasons[keyof typeof ActionFailureReasons]

export type ActionResult = OperationResult<ActionFailureReason>

export type DeleteFailureReason = typeof DeleteFailureReasons[keyof typeof DeleteFailureReasons]

export type DeleteResult = OperationResult<DeleteFailureReason>

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

export type ValidationErrorType = typeof ValidationErrorTypes[keyof typeof ValidationErrorTypes]

export type BuiltinInputError = {
  type: Exclude<ValidationErrorType, 'validation_error:custom'>
  field: string
}

export type CustomInputError = {
  type: 'validation_error:custom'
  field: string
  message: string
}

export type InputError = BuiltinInputError | CustomInputError

export type ErrorResponse = {
  error: {
    message: string
    inputErrors?: InputError[]
  }
}

export type ActionInfo = {
  id: string
  title: string
  icon?: string
}
