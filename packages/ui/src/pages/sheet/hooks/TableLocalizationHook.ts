import { useMemo } from 'react'
import { Localization } from 'material-table'

import { tableLocalization } from '../../../locale'
import { useLocale } from '../../../hooks/LocaleContextHook'

export type TableLocalizationHookParams = {
  forbidden: boolean
}

export const useTableLocalization = ({
  forbidden,
}: TableLocalizationHookParams): Localization => {
  const l = useLocale()
  const localization = useMemo(() => {
    return {
      ...tableLocalization,
      body: {
        ...tableLocalization.body,
        emptyDataSourceMessage: forbidden
          ? l.table.permissionDenied
          : l.table.emptyList,
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forbidden])
  return localization
}
