import { View } from '@sheeted/core'

import { ExampleEntity } from './example.entity'

export const ExampleView: View<ExampleEntity> = {
  title: 'Example',
  display: (entity) => entity.name,
  columns: [
    {
      field: 'name',
      title: 'NAME',
    },
  ],
}
