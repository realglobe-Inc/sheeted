import { useParams } from 'react-router-dom'
import { SheetOverview } from '@sheeted/core/build/web/Shared.type'
import { useState, useEffect } from 'react'

import { useSheetContext } from './SheetContextHook'

/**
 * Get current sheet from sheet context.
 * This can be used in Route
 */
export const useCurrentSheet = (): {
  ready: boolean
  sheet: SheetOverview | null
} => {
  const { sheets, ready: sheetsReady } = useSheetContext()
  const { sheetName } = useParams()
  const [current, setCurrent] = useState('')
  const sheet =
    sheets.sheets.find((sheet) => sheet.sheetName === sheetName) || null

  // MaterialTable コンポーネントに対するハック。別テーブルに切り替えるときに props を更新するのではダメで、
  // 一瞬 MaterialTable コンポーネントを破棄して再生成しなくてはいけない
  const name = sheet?.sheetName || ''
  useEffect(() => {
    setCurrent(name)
  }, [name])

  const ready = sheetsReady && current === name
  if (!ready) {
    return {
      ready: false,
      sheet: null,
    }
  }
  return {
    ready: true,
    sheet,
  }
}
