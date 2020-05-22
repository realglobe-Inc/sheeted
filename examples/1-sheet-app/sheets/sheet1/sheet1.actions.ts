import { Action } from '@sheeted/core'

import { Sheet1Entity } from './sheet1.entity'
import { Sheet1Model } from './sheet1.model'

export const SheetActions: Action<Sheet1Entity>[] = [
  {
    id: 'increment',
    title: 'Increment integer',
    icon: 'exposure_plus_1',
    perform: async (entities) => {
      await Sheet1Model.updateMany(
        {
          id: {
            $in: entities.map(({ id }) => id),
          },
        },
        {
          $inc: {
            integer: 1,
          },
        },
      )
    },
  },
]
