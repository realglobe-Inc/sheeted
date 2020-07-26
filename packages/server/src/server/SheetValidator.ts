import { Sheet, Types } from '@sheeted/core'

import { equals } from '../utils/objectUtil'

export type ErrorDetail = {
  sheetName: string
  path: string
  message: string
}

class SheetValidationError extends Error {
  name = 'SheetValidationError'

  static from(details: ErrorDetail[]) {
    const messages: string[] = ['']
    for (const { sheetName, path, message } of details) {
      messages.push(
        `- ${message}, in sheet "${sheetName}" at object path "${path}".`,
      )
    }
    return new this(messages.join('\n'))
  }
}

export const validateSheet = (sheet: Sheet): ErrorDetail[] => {
  const sheetName = sheet.name
  const fieldNames = Object.keys(sheet.Schema)
  const details: ErrorDetail[] = []
  for (const fieldName of fieldNames) {
    const field = sheet.Schema[fieldName]
    const isEntityType = equals(field.type, Types.Entity)
    const isEnumType =
      equals(field.type, Types.Enum) || equals(field.type, Types.EnumList)
    if (isEntityType && !field.entityProperties) {
      details.push({
        sheetName,
        path: `.Schema.${fieldName}`,
        message: `Property "entityProperties" is required when field type is Entity`,
      })
    }
    if (
      isEntityType &&
      field.entityProperties?.onDelete === 'SET_NULL' &&
      !field.optional
    ) {
      details.push({
        sheetName,
        path: `.Schema.${fieldName}`,
        message: `Property "optional" must be true when entityProperties.onDelete is "SET_NULL"`,
      })
    }
    if (isEnumType && !field.enumProperties) {
      details.push({
        sheetName,
        path: `.Schema.${fieldName}`,
        message: `Property "enumProperties" is required when field type is Enum or EnumList`,
      })
    }
    if (isEnumType && !sheet.View.columns[fieldName]?.enumLabels) {
      details.push({
        sheetName,
        path: `.View.colums.${fieldName}`,
        message: `Property "enumLabels" is required when field type is Enum or EnumList`,
      })
    }
    if (
      sheet.View.columns[fieldName]?.detailPageOnly &&
      !(sheet.View.enableDetail && field.readonly)
    ) {
      details.push({
        sheetName,
        path: `.View.columns.${fieldName}`,
        message: `Property "detailPageOnly" is invalid when the field isn't readonly`,
      })
    }
  }
  return details
}

export const validateSheets = (sheets: readonly Sheet[]): void => {
  const sheetNames = sheets.map((sheet) => sheet.name)
  const duplicateNames = sheetNames.filter(
    (name, i) => sheetNames.indexOf(name) !== i,
  )
  let details: ErrorDetail[] = []
  for (const sheetName of duplicateNames) {
    details.push({
      sheetName,
      path: '.name',
      message: `Sheet name "${sheetName}" is duplicate. Every sheet name must be unique in an application`,
    })
  }
  for (const sheet of sheets) {
    details = details.concat(validateSheet(sheet))
  }
  if (details.length > 0) {
    throw SheetValidationError.from(details)
  }
}
