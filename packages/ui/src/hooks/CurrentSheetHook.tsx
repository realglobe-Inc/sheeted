import { useParams } from 'react-router-dom'
import { SheetOverview } from '@sheeted/core/build/web/Shared.type'

import { useSheetContext } from './SheetContextHook'

/**
 * Get current sheet from sheet context.
 * This can be used in Route
 */
export const useCurrentSheet = (): SheetOverview | null => {
  const { sheets } = useSheetContext()
  const { sheetName } = useParams()
  const currentSheet =
    sheets.sheets.find((sheet) => sheet.sheetName === sheetName) || null
  return currentSheet
}
