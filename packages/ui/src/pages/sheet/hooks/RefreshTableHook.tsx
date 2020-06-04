import { useCallback } from 'react'

export type TableRef = {
  onChangePage: (event: any, page: number) => void
  onQueryChange: () => void
}

export type RefreshTable = (page?: number) => void

export const useRefreshTable = (tableRef?: TableRef): RefreshTable => {
  const refreshTable = useCallback(
    (page?: number) => {
      if (tableRef) {
        if (typeof page === 'number') {
          tableRef.onChangePage(null, page)
        } else {
          tableRef.onQueryChange()
        }
      }
    },
    [tableRef],
  )
  return refreshTable
}
