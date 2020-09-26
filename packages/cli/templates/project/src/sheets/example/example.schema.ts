import { Types, Schema } from '@sheeted/core'

import { ExampleEntity } from './example.entity'

export const ExampleSchema: Schema<ExampleEntity> = {
  name: {
    type: Types.Text,
    optional: true,
  },
}
