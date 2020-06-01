import { Sheet } from '@sheeted/core'

export type DisplayFunctions = {
  [sheetName: string]: (entity: any) => string
}

export const getDisplayFunctions = (sheets: Sheet[]): DisplayFunctions => {
  return sheets.reduce(
    (funcs, sheet) => ({
      ...funcs,
      [sheet.name]: (entity: unknown): string => {
        try {
          return sheet.View.display(entity)
        } catch (e) {
          return ''
        }
      },
    }),
    {},
  )
}
