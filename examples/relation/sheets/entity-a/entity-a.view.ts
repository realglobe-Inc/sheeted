import { View } from '@sheeted/core'
import { CALENDAR_DATETIME_FORMAT } from '@sheeted/core/build/interceptors'

import { EntityAEntity } from './entity-a.entity'

export const EntityAView: View<EntityAEntity> = {
  title: 'Entity A',
  display: (entity) => entity.name,
  enableDetail: true,
  columns: [
    {
      field: 'name',
      title: 'NAME',
    },
    {
      field: 'date',
      title: 'DATE',
    },
    {
      field: 'createdAt',
      title: 'Create Date',
      detailPageOnly: true,
      numericOptions: {
        formatAsDate: CALENDAR_DATETIME_FORMAT,
      },
    },
    {
      field: 'updatedAt',
      title: 'Update Date',
      detailPageOnly: true,
      numericOptions: {
        formatAsDate: CALENDAR_DATETIME_FORMAT,
      },
    },
  ],
}
