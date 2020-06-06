import { InputForm } from '../Type.type'
import { SheetGroup } from '../SheetGroup.type'

import { ENTITY_META_FIELD } from './Consts'
export type Column = {
  field: string
  title: string
  form?: InputForm
  formOptions?: any
  index: number

  searchable?: boolean
  readonly?: boolean
  // based on access policy
  readonlyOnCreate?: boolean
  readonlyOnUpdate?: boolean

  entityColumnProperties?: {
    sheetName: string
  }
  enumColumnProperties?: {
    multiple?: boolean
    labels: {
      label: string
      value: string
    }[]
  }
  textColumnProperties?: {
    isLink?: boolean
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
  sort: string[]
}

export type ListResult = {
  entities: any[]
  total: number
  page: number
  pages: number
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
