import { SheetOverview } from '@sheeted/core/build/web/Shared.type'
import { useState, useEffect } from 'react'

/**
 * Sheet ready state.
 */
export const useSheetReady = (sheet: SheetOverview | null): boolean => {
  const [sheetName, setSheetName] = useState('')
  useEffect(() => {
    if (sheet) {
      setSheetName(sheet.sheetName)
    }
  }, [sheet])
  return sheetName === sheet?.sheetName
}
