import { SheetGroup } from '@sheeted/core'
import { SheetOverview } from '@sheeted/core/build/web/Shared.type'
import { useMemo } from 'react'

const DEFAULT_GROUP = {
  title: undefined,
  key: Symbol('default group'),
}

export const useSheetGroups = ({
  sheets,
  groups,
}: {
  sheets: SheetOverview[]
  groups: SheetGroup[]
}): {
  title?: string
  sheets: SheetOverview[]
}[] => {
  return useMemo(() => {
    const grouped = sheets.map((sheet) => ({
      sheet,
      group: groups.find((group) => group.key === sheet.group) || DEFAULT_GROUP,
    }))
    const sheetGroups = [DEFAULT_GROUP, ...groups].map((group) => ({
      title: group.title,
      sheets: grouped
        .filter((sheet) => sheet.group.key === group.key)
        .map(({ sheet }) => sheet),
    }))
    return sheetGroups
  }, [sheets, groups])
}
